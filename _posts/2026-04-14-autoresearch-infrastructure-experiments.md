---
layout: post
title: "Building Infrastructure for Autonomous Research: Three Experiments"
date: 2026-04-14
permalink: /blogs/autoresearch_infrastructure_experiments.html
description: "When AI runs 100 experiments a night, what breaks? Three open-source prototypes for autoresearch infrastructure: evolutionary curation, cascade contamination prevention, and machine-native knowledge formats."
og_image: /assets/images/blog/autoresearch-infra/eed-fitness.png
tags:
  - metascience-experiment
---

<h2>Building Infrastructure for Autonomous Research: Three Experiments</h2>
<h3 style="text-align: center;">When AI runs 100 experiments a night, what breaks?</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The autoresearch era is here</h3>

    <p>We have entered the era of autonomous research. Andrej Karpathy's <a href="https://github.com/karpathy/autoresearch" target="_blank" rel="noopener noreferrer">autoresearch</a> project demonstrated a simple but powerful idea: give an LLM a research question, let it write and run experiments, and log the results &mdash; all night, every night. People are already reporting running 100+ experiments per night on a single H100, with a keep rate of about 15%.</p>

    <p>Sakana AI's <a href="https://sakana.ai/ai-scientist/" target="_blank" rel="noopener noreferrer">AI Scientist v2</a> showed that LLM-driven research can produce papers with novel contributions, though 42% of runs still fail due to coding errors. The message is clear: autonomous research systems are productive, but noisy.</p>

    <p>And here lies the problem. The current infrastructure for managing autoresearch output is essentially flat logging &mdash; TSV files, JSON lines, or simple databases where every result is stored equally. This works when a human reviews 10 results. It does not work when the pipeline generates 100 results per night and the outputs of one experiment become the inputs to the next.</p>

    <p>I believe that <strong>autoresearch needs its own infrastructure layer</strong> &mdash; systems that handle curation, quality assurance, and knowledge representation at machine speed. To explore this, I built three open-source prototypes, each addressing a different failure mode. I then validated all three against real autoresearch output.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 Three failure modes, three experiments</h3>

    <p>When you scale autonomous research, three things break:</p>

    <ol>
        <li><strong>Curation</strong>: Good results are buried alongside failures in flat logs. There is no mechanism for good configurations to propagate or build on each other.</li>
        <li><strong>Reliability</strong>: A false positive &mdash; an experiment that "succeeds" but doesn't reproduce &mdash; can poison every downstream experiment that treats it as a premise. At machine speed, this cascade contamination unfolds in hours.</li>
        <li><strong>Knowledge transfer</strong>: When AI agents are both the producers and consumers of research, routing knowledge through human-readable papers (PDFs, PNG figures) is a lossy bottleneck.</li>
    </ol>

    <p>Each experiment targets one of these failure modes.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 Validation: Building a real autoresearch pipeline</h3>

    <p>Before diving into each prototype, a note on methodology. It would be easy to build these tools and test them only on synthetic data. I did that first &mdash; and then realized that claiming to build "autoresearch infrastructure" without testing against actual autoresearch output is not credible.</p>

    <p>So I built <a href="https://github.com/t46/autoresearch-lite" target="_blank" rel="noopener noreferrer">autoresearch-lite</a>, a lightweight autoresearch loop that follows Karpathy's design: an LLM proposes modifications to a training script, the script runs, results are logged, and improvements are kept while regressions are discarded. The task is CIFAR-10 image classification with a CNN, running on an Apple Silicon MacBook Pro (M3 Max).</p>

    <p>The loop ran 21 experiments autonomously. An LLM proposed hyperparameter changes (learning rate, optimizer, architecture, regularization), each experiment trained for up to 60 seconds, and the system logged results in a Karpathy-compatible <code>results.tsv</code>:</p>

    <ul>
        <li><strong>3 kept</strong> (improved accuracy): baseline, increased epochs, reduced weight decay</li>
        <li><strong>16 discarded</strong> (no improvement): LR tuning, architecture changes, augmentation tweaks</li>
        <li><strong>2 crashed</strong>: a failed residual connection attempt and an LLM parsing error</li>
    </ul>

    <p>Validation accuracy improved from 0.709 (baseline) to 0.740 (best). This is a real autoresearch session &mdash; real gradients, real loss curves, real GPU memory &mdash; and the output is what all three prototypes were validated against.</p>

    <p><a href="https://github.com/t46/autoresearch-lite" target="_blank" rel="noopener noreferrer">GitHub: t46/autoresearch-lite</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Evolutionary Experiment Database: Selection at scale</h3>

    <p><strong>Problem:</strong> Flat experiment logs treat every result equally. A brilliant configuration and a random failure occupy the same row in a TSV.</p>

    <p><strong>Approach:</strong> Treat each experiment result as an <em>individual</em> in an evolutionary population. Define a fitness function over result quality, reproducibility, novelty, and efficiency. Apply tournament selection, crossover, and mutation to propagate good configurations and explore their neighborhood.</p>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/eed-fitness.png" alt="Fitness progression over 15 evolutionary generations from autoresearch-lite data">
        <figcaption style="text-align: center;">Fitness progression over 15 generations: best, mean, and min fitness from real autoresearch-lite experiments</figcaption>
    </figure>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/eed-genealogy.png" alt="Genealogy tree showing evolutionary relationships between experiments">
        <figcaption style="text-align: center;">Genealogy tree: nodes colored by fitness (red=low, green=high), edges by operation type (blue=crossover, green=mutation, gray=elite)</figcaption>
    </figure>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/eed-fitness-components.png" alt="Fitness component breakdown showing quality, reproducibility, novelty, and efficiency scores">
        <figcaption style="text-align: center;">Fitness component breakdown across the population: quality dominates, but reproducibility and novelty contribute meaningful separation</figcaption>
    </figure>

    <p><strong>Validation result:</strong> When fed the 21 autoresearch experiments, the fitness function correctly separated outcomes: keep experiments scored 0.62, discards 0.57, and crashes 0.10. Over 10 generations of evolution, fitness improved by 9.4%. Critically, crossover operated on actual hyperparameters &mdash; combining the learning rate from one experiment with the weight decay from another &mdash; which is a standard and meaningful hyperparameter search strategy. The system even "rediscovered" <code>weight_decay=5e-5</code>, the value that produced the best real result.</p>

    <p><strong>Limitation:</strong> Evolution operated on numeric hyperparameters but could not mutate categorical choices (optimizer type, activation function). Population diversity collapsed by generation 7 due to small population size (21 individuals). Most importantly, the system generates new hyperparameter configurations but has no pipeline to actually run them &mdash; it can propose but not verify.</p>

    <p><strong>Metascience insight:</strong> Evolutionary selection is a natural fit for hyperparameter-level autoresearch. But for higher-level research &mdash; evolving hypotheses, not just hyperparameters &mdash; the genetic operators need to work at the semantic level, requiring LLM integration for crossover and mutation.</p>

    <p><a href="https://github.com/t46/evolutionary-experiment-database" target="_blank" rel="noopener noreferrer">GitHub: t46/evolutionary-experiment-database</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 Epistemic Cascade Validator: Breaking the contamination chain</h3>

    <p><strong>Problem:</strong> In an experiment chain A &rarr; B &rarr; C, if A produces a false positive, B and C build on a false premise. In traditional science, peer review catches this one paper at a time. In autoresearch, 100 experiments per night makes human review impossible.</p>

    <p><strong>Approach:</strong> Assign each experiment result a Bayesian confidence score computed from reproduction rate (40%), statistical evidence (25%), effect size (20%), and code quality (15%). A decision engine gates results below a confidence threshold, preventing low-confidence outputs from becoming downstream premises.</p>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/ecv-table.png" alt="ECV scoring each autoresearch experiment with confidence scores, color-coded by status">
        <figcaption style="text-align: center;">Each autoresearch experiment scored: confidence color-coded (green=high, red=low), crashes correctly BLOCKED</figcaption>
    </figure>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/ecv-cascade.png" alt="Cascade chain graph showing experiment dependencies and confidence scores">
        <figcaption style="text-align: center;">Cascade chain: all 21 experiments with dependency edges, colored by confidence. Red borders indicate gated (blocked) experiments</figcaption>
    </figure>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/ecv-gating.png" alt="Confidence decay along keep chain and gating effectiveness metrics">
        <figcaption style="text-align: center;">Confidence decays along the keep chain (0.61 &rarr; 0.27), crossing below the 0.40 threshold</figcaption>
    </figure>

    <p><strong>Validation result:</strong> Against the 21 autoresearch experiments, the system correctly ordered confidence scores: keep (0.66) &gt; discard (0.56) &gt; crash (0.22). Both crashes were correctly gated (100% crash detection). In the cascade analysis, the 3-node keep chain (baseline &rarr; epochs increase &rarr; weight decay reduction) showed confidence compounding from 0.61 down to 0.27 &mdash; correctly flagging that accumulated uncertainty makes downstream results less trustworthy.</p>

    <p><strong>Limitation:</strong> The separation between keep and discard was not statistically significant (p=0.42, only 3 keeps). The effect size mapping is direction-agnostic: a large accuracy <em>drop</em> gets a high effect size score, inflating discard confidence. With N=21, the validation shows the system runs on real data and produces reasonable orderings, but cannot establish statistical calibration.</p>

    <p><strong>Metascience insight:</strong> The reproducibility crisis plays out at machine speed in autoresearch. Confidence scoring is a viable mechanism, but it needs to be direction-aware and validated at scale (hundreds of experiments). The cascade compounding result is particularly interesting: even a chain of three "good" experiments accumulates enough uncertainty to cross below the gating threshold, suggesting that autoresearch pipelines may need periodic "re-anchoring" through independent reproduction.</p>

    <p><a href="https://github.com/t46/epistemic-cascade-validator" target="_blank" rel="noopener noreferrer">GitHub: t46/epistemic-cascade-validator</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;6 LLM-Native Research Artifacts: Knowledge for machines</h3>

    <p><strong>Problem:</strong> Scientific knowledge is packaged for human consumption: natural language papers, visual figures, implicit assumptions. When AI agents are the primary readers, this format is a bottleneck. Research by <a href="https://arxiv.org/abs/2504.02601" target="_blank" rel="noopener noreferrer">AgentRxiv</a> showed that machine-optimized formats improve AI performance by 13.7% on reasoning benchmarks.</p>

    <p><strong>Approach:</strong> Define structured artifact schemas (Pydantic v2 models) where uncertainty, conditions, causation, and provenance are first-class citizens &mdash; not sentences buried in section 4.3 of a PDF. Build an agent interface with three operations: <code>query()</code> for structured Q&A, <code>compose()</code> for cross-artifact synthesis, and <code>diff()</code> for contradiction detection.</p>

    <figure>
        <img src="/assets/images/blog/autoresearch-infra/lnra-demo.png" alt="LNRA interactive demo showing structured artifact explorer">
        <figcaption style="text-align: center;">LNRA interactive demo: browsing a structured research artifact with claims, results, and provenance</figcaption>
    </figure>

    <p><strong>Validation result:</strong> The entire autoresearch session (results.tsv + train.py + git log) was converted into a structured artifact. All 5 research queries returned correct answers: the system identified that increasing epochs was the most impactful change (+2.69%), correctly diagnosed both crash causes, and detected the diminishing-returns pattern in late experiments. <code>compose()</code> with an existing Attention Is All You Need artifact surfaced novel insights about how iterative optimization and architectural innovation are complementary strategies. <code>diff()</code> correctly found zero method overlap and identified methodology differences.</p>

    <p><strong>Limitation:</strong> Autoresearch output required reshaping into a "pseudo-paper" format before the converter could process it &mdash; no native TSV/log ingestion. The resulting artifact was quantitatively sparser than artifacts from real papers (fewer precise metrics, no confidence intervals). The entire 21-experiment session compressed into a single artifact, losing per-experiment granularity.</p>

    <p><strong>Metascience insight:</strong> The most valuable operation for autoresearch turned out to be <code>compose()</code>, not <code>query()</code>. Individual experiment results are easy to log; what's hard is synthesizing patterns across many experiments. The cross-artifact synthesis &mdash; finding that "critique calibration is the key differentiator" or that "d-separation explains ablation gaps" &mdash; surfaced insights not visible in any individual experiment. This suggests that the primary value of structured knowledge representations in autoresearch is <em>aggregation</em>, not retrieval.</p>

    <p><a href="https://github.com/t46/llm-native-research-artifacts" target="_blank" rel="noopener noreferrer">GitHub: t46/llm-native-research-artifacts</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;7 How the three connect</h3>

    <p>These experiments are complementary layers of the same stack:</p>

    <ul>
        <li><strong>Individual level</strong>: The Evolutionary Experiment Database selects and propagates good experiments within a population.</li>
        <li><strong>Chain level</strong>: The Epistemic Cascade Validator prevents unreliable results from corrupting downstream work.</li>
        <li><strong>Knowledge level</strong>: LLM-Native Research Artifacts ensure that when results do propagate, they carry structured uncertainty, conditions, and provenance that downstream agents can reason about.</li>
    </ul>

    <p>Together, they sketch an infrastructure layer for autonomous research that goes beyond "run experiments and log results." The goal is a system where quality emerges from the structure itself &mdash; where good results are amplified, bad results are contained, and knowledge flows in formats that machines can actually use.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;8 Metascience reflections</h3>

    <p>Building and validating these prototypes surfaced several insights that I did not anticipate:</p>

    <p><strong>The infrastructure gap is real, but the shape is surprising.</strong> I expected the main challenge to be algorithmic &mdash; designing better scoring functions or smarter evolutionary operators. Instead, the hardest part was the <em>adapter layer</em>: mapping the messy, heterogeneous output of real autoresearch systems into structured formats. Every data source had a different shape. This suggests that the first and most impactful infrastructure investment for autoresearch is not a better algorithm but a <em>standard output format</em>.</p>

    <p><strong>Small N is the enemy.</strong> With 21 experiments, statistical claims are fragile. The ECV's keep-vs-discard separation was not significant. The EED's population diversity collapsed in 7 generations. Many of the "limitations" in these prototypes are actually just "need more data." This is both good news (the tools may work fine at scale) and a methodological warning (validating autoresearch infrastructure requires autoresearch at scale).</p>

    <p><strong>The semantic gap.</strong> The EED revealed a fundamental tension: evolutionary operators work on numeric vectors, but research experiments are structured objects where meaning lives in the text. "Crossing learning rate from experiment A with weight decay from experiment B" is meaningful. "Crossing hypothesis A with hypothesis B" requires understanding what a hypothesis <em>means</em>. The gap between hyperparameter optimization (well-suited for evolution) and hypothesis evolution (requires semantic understanding) is the frontier.</p>

    <p><strong>Aggregation over retrieval.</strong> LNRA's most valuable operation was not <code>query()</code> (answering questions about one experiment) but <code>compose()</code> (synthesizing patterns across many). This suggests that as autoresearch scales, the bottleneck shifts from "finding results" to "understanding what the results collectively mean." The infrastructure layer needs to support not just storage and retrieval, but synthesis.</p>

    <p><strong>Honest validation matters.</strong> The first version of these tools was tested only on synthetic data. The second was tested against our own research automation tools, which we initially framed as "autoresearch validation" &mdash; but it wasn't, because none of those tools actually ran ML experiments. Only after building autoresearch-lite and running real experiments could we make honest claims. This experience reinforces a core metascience principle: <em>the credibility of infrastructure depends on the credibility of its validation</em>.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;9 What's next</h3>

    <p>These are prototypes with honest limitations, not production systems. Each one tests a specific hypothesis:</p>

    <ul>
        <li>That evolutionary selection is a better curation mechanism than flat logging for autonomous research. <strong>Supported at the hyperparameter level; open question at the hypothesis level.</strong></li>
        <li>That Bayesian confidence scoring can prevent cascade contamination without human review. <strong>Crash detection works; keep/discard separation needs more data and direction-aware scoring.</strong></li>
        <li>That machine-native knowledge representations outperform human-readable formats for AI-to-AI communication. <strong>Compose() is the killer feature; native log ingestion is needed.</strong></li>
    </ul>

    <p>Next steps include scaling to hundreds of experiments, integrating the tools with live autoresearch pipelines, and developing LLM-based genetic operators for semantic-level evolution. I plan to continue releasing experiments like these &mdash; open-source prototypes that explore what research infrastructure should look like when AI does the research.</p>

    <p>If you're working on similar problems, I'd love to <a href="https://x.com/takagi_shiro" target="_blank" rel="noopener noreferrer">hear from you</a>. All code is open source:</p>

    <ul>
        <li><a href="https://github.com/t46/autoresearch-lite" target="_blank" rel="noopener noreferrer">autoresearch-lite</a> &mdash; lightweight Karpathy-compatible autoresearch loop for Apple Silicon</li>
        <li><a href="https://github.com/t46/evolutionary-experiment-database" target="_blank" rel="noopener noreferrer">evolutionary-experiment-database</a> &mdash; evolutionary selection and genealogy tracking for experiment results</li>
        <li><a href="https://github.com/t46/epistemic-cascade-validator" target="_blank" rel="noopener noreferrer">epistemic-cascade-validator</a> &mdash; Bayesian confidence scoring and cascade contamination prevention</li>
        <li><a href="https://github.com/t46/llm-native-research-artifacts" target="_blank" rel="noopener noreferrer">llm-native-research-artifacts</a> &mdash; structured knowledge representations for AI-to-AI research communication</li>
    </ul>
</section>
