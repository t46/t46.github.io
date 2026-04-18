---
layout: post
title: "Research PageRank: Trust Propagation in Bipolar Argumentation Graphs"
date: 2026-04-18
permalink: /blogs/research_pagerank.html
description: "Can a signed PageRank variant produce trust scores that match human intuition about research claim reliability? A prototype with 12 AI research claims, 4/5 intuition checks passed."
tags:
  - metascience-experiment
---

<h2>Research PageRank: Trust Propagation in Bipolar Argumentation Graphs</h2>
<h3 style="text-align: center;">What if we ranked research claims the way Google ranks web pages?</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The problem: claims don't exist in isolation</h3>

    <p>Scientific knowledge isn't a collection of independent facts. It's a network. "Neural scaling laws predict performance" <em>supports</em> "Larger models are better." The Chinchilla results <em>contradict</em> "Larger models are always compute-optimal." RLHF reward hacking concerns <em>contradict</em> "RLHF effectively aligns models."</p>

    <p>When we evaluate the reliability of a claim, we implicitly reason about this network: a claim supported by well-established results is more trustworthy than one contradicted by strong evidence. But doing this manually doesn't scale. In an era of autonomous research generating claims at machine speed, we need algorithmic trust propagation.</p>

    <p>PageRank solved an analogous problem for the web: a page linked to by many important pages is itself important. But standard PageRank assumes all links are endorsements. Scientific links are <em>bipolar</em>: they can support or contradict.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 Approach: Signed PageRank</h3>

    <p>The idea is simple. Build a directed graph where:</p>

    <ul>
        <li><strong>Nodes</strong> are research claims (e.g., "Scaling laws predict performance")</li>
        <li><strong>Edges</strong> are typed as <em>supports</em> (positive trust propagation) or <em>contradicts</em> (negative trust propagation), with optional weights</li>
    </ul>

    <p>Then run a modified PageRank:</p>

    <ol>
        <li>Build a signed adjacency matrix where supports edges have positive weight and contradicts edges have negative weight</li>
        <li>Column-normalize so each source distributes equal total influence</li>
        <li>Power iteration with damping: <code>trust(t+1) = (1-d) * prior + d * A_norm @ trust(t)</code></li>
        <li>Clamp to [0, 1] after each iteration</li>
    </ol>

    <p>This builds on bipolar argumentation frameworks (Cayrol &amp; Lagasquie-Schiex, 2005) and is related to TrustRank and BiRank, but keeps the implementation deliberately minimal.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 Sample data</h3>

    <p>I constructed a graph of 12 claims from real AI research debates, connected by 15 edges (7 supports, 8 contradicts):</p>

    <ul>
        <li><strong>Scaling laws</strong> supports <strong>bigger is better</strong> (weight 0.8)</li>
        <li><strong>Chinchilla</strong> contradicts <strong>bigger is better</strong> (weight 0.9)</li>
        <li><strong>Data quality</strong> contradicts <strong>bigger is better</strong> (weight 0.6)</li>
        <li><strong>Benchmark saturation</strong> contradicts <strong>bigger is better</strong> (weight 0.5)</li>
        <li><strong>Emergent mirage</strong> contradicts <strong>emergent abilities</strong> (weight 0.85)</li>
        <li><strong>Reward hacking</strong> contradicts <strong>RLHF alignment</strong> (weight 0.8)</li>
        <li>...and 9 more edges</li>
    </ul>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Results</h3>

    <p>The algorithm converged in 6 iterations. Here's the trust ranking:</p>

    <table>
        <thead>
            <tr><th>Rank</th><th>Claim</th><th>Trust Score</th><th>Why</th></tr>
        </thead>
        <tbody>
            <tr><td>1</td><td>Scaling laws</td><td>0.1122</td><td>Well-supported, no contradictions</td></tr>
            <tr><td>2</td><td>Chinchilla</td><td>0.1093</td><td>Supported by data_quality</td></tr>
            <tr><td>3</td><td>Reasoning not stochastic</td><td>0.1003</td><td>Net positive support</td></tr>
            <tr><td>4-8</td><td>Leaf nodes (mirage, reward hacking, etc.)</td><td>0.0750</td><td>No incoming edges, retain prior</td></tr>
            <tr><td>9</td><td>Chain-of-thought</td><td>0.0402</td><td>Supported but also contradicted</td></tr>
            <tr><td>10</td><td>Emergent abilities</td><td>0.0180</td><td>2 supports, 2 contradicts</td></tr>
            <tr><td>11</td><td>RLHF alignment</td><td>0.0113</td><td>Only incoming is contradiction</td></tr>
            <tr><td>12</td><td>Bigger is better</td><td>0.0000</td><td>1 support, 3 contradictions</td></tr>
        </tbody>
    </table>

    <p><strong>Intuition check: 4/5 passed.</strong></p>

    <ul>
        <li>PASS: scaling_laws &gt; bigger_better (well-established vs. oversimplified)</li>
        <li>PASS: chinchilla &gt; bigger_better (empirical result vs. contradicted claim)</li>
        <li>PASS: data_quality &gt; bigger_better (quality emphasis vs. scale emphasis)</li>
        <li>FAIL: chain_of_thought &gt; cot_unfaithful (CoT gets penalized; its critic doesn't)</li>
        <li>PASS: rlhf_alignment &lt; rlhf_reward_hacking (disputed vs. critique)</li>
    </ul>

    <p><img src="https://raw.githubusercontent.com/t46/research-pagerank/main/output/graph.png" alt="Research PageRank Graph" style="max-width: 100%;"></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 What we learned</h3>

    <h4>What works</h4>

    <p><strong>Contradiction drainage is the main success.</strong> The most-contradicted claim ("bigger is always better") correctly gets its trust drained to zero. Claims with balanced incoming edges get intermediate scores. The topology-driven ranking aligns with intuition in most cases.</p>

    <h4>What doesn't work</h4>

    <p><strong>Score compression is the main failure.</strong> All scores fall in [0, 0.11], which means the visualization shows everything as red. The combination of negative edge propagation and clamping at zero creates deflationary pressure. A production system would need normalization or a different formulation.</p>

    <p><strong>The "unchallenged critic" bias.</strong> The one failed intuition check reveals a structural problem: pure critic nodes (like cot_unfaithful) that only contradict others without being contradicted themselves retain their prior trust. In practice, we'd expect a critique that faces no counter-critique to be suspicious, not reliable.</p>

    <h4>Connection to broader metascience work</h4>

    <p>This connects to two ongoing threads:</p>

    <ul>
        <li><strong>Research social infrastructure</strong>: Trust propagation could feed into automated peer review systems. A claim's trust score reflects the entire epistemic network, not just direct evidence.</li>
        <li><strong>Meta-game architecture</strong>: In a contribution-based research platform, Research PageRank could determine "epistemic weight" per contribution, creating incentives for well-supported claims and productive challenges.</li>
    </ul>

    <p>Previous experiments in this series explored Bayesian confidence scoring (<a href="https://github.com/t46/epistemic-cascade-validator">Epistemic Cascade Validator</a>) and negative result structuring (<a href="https://github.com/t46/negative-result-repository">Negative Result Repository</a>). Research PageRank adds a network-level perspective: claim reliability is not just about local evidence but about position in an argumentation graph.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;6 What would make this real</h3>

    <ol>
        <li><strong>Automated graph construction</strong>: Use LLMs to extract supports/contradicts relations from paper text</li>
        <li><strong>Evidence weighting</strong>: Edge weights from citation counts, methodology quality, sample size</li>
        <li><strong>Dynamic updates</strong>: Re-rank when new papers enter the graph</li>
        <li><strong>Ground truth validation</strong>: Compare against expert meta-analyses or systematic reviews</li>
    </ol>

    <p>Code: <a href="https://github.com/t46/research-pagerank">github.com/t46/research-pagerank</a></p>
</section>
