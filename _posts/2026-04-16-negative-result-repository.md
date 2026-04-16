---
layout: post
title: "Negative Result Repository: Learning from Failed Experiments at Machine Speed"
date: 2026-04-16
permalink: /blogs/negative_result_repository.html
description: "85% of autoresearch experiments fail and are thrown away. A prototype that structures, searches, and extracts rules from negative results, validated against 21 real experiments."
tags:
  - metascience-experiment
---

<h2>Negative Result Repository: Learning from Failed Experiments at Machine Speed</h2>
<h3 style="text-align: center;">85% of experiments fail. What if we stopped throwing them away?</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The waste problem in autoresearch</h3>

    <p>Autonomous research pipelines generate experiments at machine speed. Karpathy's <a href="https://github.com/karpathy/autoresearch" target="_blank" rel="noopener noreferrer">autoresearch</a> runs 100+ experiments per night, but roughly 85% are discarded or crash. In my own <a href="https://github.com/t46/autoresearch-lite" target="_blank" rel="noopener noreferrer">autoresearch-lite</a> session, 18 out of 21 experiments failed.</p>

    <p>Currently, these failures are stored as single rows in a TSV file:</p>

    <pre><code>61b4eb4  0.693100  1.1  discard  Increase learning rate from 0.01 to 0.1
1a88964  0.444700  1.1  discard  Switch optimizer from SGD to AdamW
72ce38e  0.000000  0.0  crash    Add residual connections to the CNN</code></pre>

    <p>This is the entirety of what the system learns from each failure: a commit hash, a number, a status, and a sentence. The system then proceeds to the next experiment, often proposing changes that are structurally similar to things that already failed.</p>

    <p>In my 21-experiment session, the LLM proposed increasing the learning rate <em>four separate times</em> (to 0.1, 0.012, 0.013, and 0.015), all of which failed. It also tried three different architectural expansions (doubling filters, increasing FC size, adding a conv block), all of which failed. The information was there in the results.tsv &mdash; but in a format that neither the LLM nor any downstream system could efficiently query.</p>

    <p>This is a metascience problem. In traditional science, negative results are systematically underreported, creating publication bias. In autoresearch, negative results are <em>generated</em> at scale but <em>discarded</em> immediately. The failure mode is different &mdash; not bias, but waste.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 What a negative result actually contains</h3>

    <p>A failed experiment is not just "it didn't work." It contains:</p>

    <ul>
        <li><strong>A config diff</strong>: what specific parameter changed, from what value to what value</li>
        <li><strong>A quantitative outcome</strong>: how much worse (or how close to baseline)</li>
        <li><strong>A failure category</strong>: regression (significantly worse), no improvement (clearly below), marginal (very close), or crash (code/infra error)</li>
        <li><strong>An implicit constraint</strong>: "this region of the search space is unpromising"</li>
    </ul>

    <p>When you have 18 such data points, patterns emerge. But only if the data is structured enough to aggregate.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 Four capabilities</h3>

    <p>The <a href="https://github.com/t46/negative-result-repository" target="_blank" rel="noopener noreferrer">Negative Result Repository</a> (NRR) is a prototype with four capabilities, each addressing a different aspect of the waste problem:</p>

    <h4>3.1 Failure structuring</h4>

    <p>The parser converts each TSV row into a structured object with:</p>

    <ul>
        <li>Extracted config diffs (e.g., <code>LEARNING_RATE: 0.01 &rarr; 0.1</code>)</li>
        <li>Failure classification: <code>no_improvement</code> (11), <code>regression</code> (3), <code>marginal</code> (2), <code>crash_code</code> (1), <code>crash_infra</code> (1)</li>
        <li>Change category: what type of change was attempted (learning_rate, architecture, regularization, etc.)</li>
        <li>A computed lesson: human-readable explanation of what this failure means</li>
    </ul>

    <p>The parser tracks config state across the experiment sequence: after experiment 7 was kept (NUM_EPOCHS: 10&rarr;15), subsequent experiments' baselines reflect that change. This matters because experiment 22's "reduce weight decay from 5e-5 to 2e-5" is relative to the post-experiment-21 config, not the original baseline.</p>

    <h4>3.2 Similarity search</h4>

    <p>Each failure is encoded as a feature vector combining accuracy delta, crash status, change category (one-hot), failure category (one-hot), number of config changes, and magnitude of numeric changes. Cosine similarity finds the most relevant past failures for a proposed new experiment.</p>

    <p>Example: querying "increase learning rate to 0.05" returns:</p>

    <pre><code>sim=0.976 | [61b4eb4] delta=-0.016 | Increase LR from 0.01 to 0.1
sim=0.821 | [7e11bde] delta=-0.005 | Double the number of filters
sim=0.688 | [437c019] delta=-0.006 | Switch from ReLU to GELU</code></pre>

    <p>The top result is exactly right: the most relevant past failure for an LR increase is the previous LR increase attempt. The system surfaces this before the experiment runs, potentially saving 60+ seconds of compute per avoided experiment.</p>

    <h4>3.3 Pattern aggregation</h4>

    <p>Individual failures are aggregated into rules. The system operates at two levels:</p>

    <p><strong>Category-level patterns</strong> (what type of change consistently fails):</p>

    <ul>
        <li><code>[1.00]</code> Learning rate changes: 5 failures, avg delta -0.013. "UNLIKELY to improve."</li>
        <li><code>[0.96]</code> Architecture changes: 4 failures (1 crash). "CAUTION: 25% crash rate."</li>
        <li><code>[0.48]</code> Regularization changes: 2 failures, avg delta -0.016.</li>
    </ul>

    <p><strong>Direction-level patterns</strong> (which direction of change fails):</p>

    <ul>
        <li><code>[1.00]</code> "AVOID increasing LEARNING_RATE. All 4 attempts failed."</li>
    </ul>

    <p>The direction analysis is particularly useful: it distinguishes "increasing LR always fails" from "any LR change always fails" &mdash; which matters because the one LR <em>decrease</em> (to 0.005) was marginal rather than clearly bad.</p>

    <h4>3.4 Autoresearch loop integration</h4>

    <p>The <code>check_proposal()</code> interface is designed to be called before each experiment in an autoresearch loop. It returns a recommendation (proceed/caution/avoid), an estimated success probability, the most similar past failures, and relevant patterns.</p>

    <p>Applied to five hypothetical proposals against the 21-experiment database:</p>

    <table>
        <tr><th>Proposal</th><th>Recommendation</th><th>Probability</th><th>Basis</th></tr>
        <tr><td>Increase LR to 0.02</td><td><strong>AVOID</strong></td><td>0%</td><td>5/5 LR changes failed; all 4 increases failed</td></tr>
        <tr><td>Switch to AdamW</td><td><strong>AVOID</strong></td><td>0%</td><td>Previous AdamW attempt: -0.265 regression</td></tr>
        <tr><td>Add residual connections</td><td><strong>AVOID</strong></td><td>0%</td><td>Previous attempt crashed; 25% architecture crash rate</td></tr>
        <tr><td>Reduce batch size to 64</td><td><strong>PROCEED</strong></td><td>33%</td><td>No strong signal against (only 1 batch size experiment)</td></tr>
        <tr><td>Mixed precision training</td><td><strong>CAUTION</strong></td><td>27%</td><td>Novel change, but multiple-change category has 50% crash rate</td></tr>
    </table>

    <p>The first three recommendations are correct: the database has strong evidence these directions fail. The fourth is also correct: batch size reduction is genuinely unexplored territory. The fifth is reasonable: mixed precision is novel enough to try but caution is warranted given limited data.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 What I learned building this</h3>

    <p><strong>The description field is the hardest part.</strong> The LLM-generated descriptions in results.tsv are natural language, and extracting structured config diffs from them requires pattern matching that is specific to each autoresearch setup. "Reduce weight decay from 1e-4 to 5e-5" parses cleanly. "Add a fourth convolutional block with 256 filters to increase model depth" requires knowing what "fourth block" means for this architecture. A standard machine-readable output format for autoresearch systems would eliminate this entire parsing layer.</p>

    <p><strong>18 failures is enough for patterns, not for statistics.</strong> The pattern "all 4 LR increases failed" is convincing to a human, but a frequentist would note that n=4 is not significant. At scale (hundreds of experiments), these patterns would carry real statistical weight. The prototype shows the structure works; scale would make it rigorous.</p>

    <p><strong>Negative results form a search space map.</strong> The 18 failures collectively define a region of the hyperparameter space that has been explored and found unpromising. This is exactly analogous to how optimization algorithms use past evaluations &mdash; except here the "evaluations" come from an LLM's choices rather than a systematic search. The NRR converts unstructured LLM-driven exploration into something closer to a Bayesian optimization history.</p>

    <p><strong>The biggest value is preventing repeated failures.</strong> In my 21-experiment session, at least 3 experiments were structurally redundant: four LR increases that all failed for the same reason. If the system had checked the NRR after the second failure, it would have saved 2 experiments (~2 minutes of GPU time, 2 API calls). At scale &mdash; 100 experiments per night &mdash; preventing 10-20% redundant failures would meaningfully reduce cost and accelerate the search toward productive regions.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 Connection to the infrastructure stack</h3>

    <p>This is the fourth prototype in a series exploring autoresearch infrastructure:</p>

    <ul>
        <li><a href="https://github.com/t46/evolutionary-experiment-database" target="_blank" rel="noopener noreferrer">Evolutionary Experiment Database</a>: selects and propagates good results</li>
        <li><a href="https://github.com/t46/epistemic-cascade-validator" target="_blank" rel="noopener noreferrer">Epistemic Cascade Validator</a>: prevents unreliable results from propagating</li>
        <li><a href="https://github.com/t46/llm-native-research-artifacts" target="_blank" rel="noopener noreferrer">LLM-Native Research Artifacts</a>: structures knowledge for machine consumption</li>
        <li><strong>Negative Result Repository</strong> (this work): structures and reuses failure information</li>
    </ul>

    <p>The EED focuses on amplifying successes. The NRR focuses on learning from failures. Together, they cover both sides: propagate what works, avoid repeating what doesn't. The ECV adds a quality gate between them, and LNRA provides the knowledge representation layer.</p>

    <p>The NRR fills a specific gap: while the other three tools operate <em>after</em> experiments complete, the NRR operates <em>before</em> the next experiment starts. It is the only tool in the stack that can prevent wasted compute rather than just organizing results after the fact.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;6 Limitations and next steps</h3>

    <p><strong>Limitations:</strong></p>

    <ul>
        <li>The parser is specific to autoresearch-lite's description format. A different autoresearch system would need different extraction rules.</li>
        <li>Similarity search uses a hand-crafted feature vector. Embedding-based search (using the description text) would be more robust.</li>
        <li>Pattern confidence scores are heuristic, not statistically calibrated.</li>
        <li>The system has not been tested in a live autoresearch loop (only retroactive analysis).</li>
    </ul>

    <p><strong>Next steps:</strong></p>

    <ul>
        <li>Integration with a live autoresearch-lite loop: inject <code>check_proposal()</code> between the LLM proposal step and the execution step</li>
        <li>LLM-based description parsing as a fallback for the regex parser</li>
        <li>Cross-session learning: accumulate negative results across multiple autoresearch sessions</li>
        <li>Standard output format proposal for autoresearch systems</li>
    </ul>

    <p><a href="https://github.com/t46/negative-result-repository" target="_blank" rel="noopener noreferrer">GitHub: t46/negative-result-repository</a></p>
</section>
