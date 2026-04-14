---
layout: post
title: "Building Infrastructure for Autonomous Research: Three Experiments"
date: 2026-04-14
permalink: /blogs/autoresearch_infrastructure_experiments.html
tags:
  - metascience-experiment
---

<h2>Building Infrastructure for Autonomous Research: Three Experiments</h2>
<h3 style="text-align: center;">When AI runs 100 experiments a night, what breaks?</h3>

<p class="authors" style="text-align: center;">
    Shiro Takagi<br>
    <small><a href="https://t46.github.io/">independent AI researcher</a></small>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The autoresearch era is here</h3>

    <p>We have entered the era of autonomous research. Andrej Karpathy's <a href="https://github.com/karpathy/autoresearch" target="_blank" rel="noopener noreferrer">autoresearch</a> project demonstrated a simple but powerful idea: give an LLM a research question, let it write and run experiments, and log the results &mdash; all night, every night. People are already reporting running 100+ experiments per night on a single H100, with a keep rate of about 15%.</p>

    <p>Sakana AI's <a href="https://sakana.ai/ai-scientist/" target="_blank" rel="noopener noreferrer">AI Scientist v2</a> showed that LLM-driven research can produce papers with novel contributions, though 42% of runs still fail due to coding errors. The message is clear: autonomous research systems are productive, but noisy.</p>

    <p>And here lies the problem. The current infrastructure for managing autoresearch output is essentially flat logging &mdash; TSV files, JSON lines, or simple databases where every result is stored equally. This works when a human reviews 10 results. It does not work when the pipeline generates 100 results per night and the outputs of one experiment become the inputs to the next.</p>

    <p>I believe that <strong>autoresearch needs its own infrastructure layer</strong> &mdash; systems that handle curation, quality assurance, and knowledge representation at machine speed. To explore this, I built three open-source prototypes, each addressing a different failure mode.</p>
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
    <h3 style="text-align: center;">&sect;3 Evolutionary Experiment Database: Selection at scale</h3>

    <p><strong>Problem:</strong> Flat experiment logs treat every result equally. A brilliant configuration and a random failure occupy the same row in a TSV.</p>

    <p><strong>Approach:</strong> Treat each experiment result as an <em>individual</em> in an evolutionary population. Define a fitness function over reproducibility, novelty, result quality, and efficiency. Apply tournament selection, crossover, and mutation to propagate good configurations and explore their neighborhood.</p>

    <p><strong>Result:</strong> The prototype manages populations of experiments through generational evolution, with full genealogy tracking. In a demo with 20 individuals over 15 generations, mean fitness improved from 0.73 to 0.77, with 494 genealogy edges recorded. The system uses SQLite for persistence and generates visualizations of fitness progression, component breakdown, genealogy trees, and population diversity.</p>

    <p><strong>Key insight:</strong> Evolutionary selection creates a natural quality gradient that flat logging cannot. Failed experiments are pruned but preserved in the genealogy as "what didn't work" &mdash; information that is lost in flat logs.</p>

    <p><a href="https://github.com/t46/evolutionary-experiment-database" target="_blank" rel="noopener noreferrer">GitHub: t46/evolutionary-experiment-database</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Epistemic Cascade Validator: Breaking the contamination chain</h3>

    <p><strong>Problem:</strong> In an experiment chain A &rarr; B &rarr; C, if A produces a false positive, B and C build on a false premise. In traditional science, peer review catches this one paper at a time. In autoresearch, 100 experiments per night makes human review impossible.</p>

    <p><strong>Approach:</strong> Assign each experiment result a Bayesian confidence score computed from reproduction rate (40%), statistical evidence (25%), effect size (20%), and code quality (15%). A decision engine gates results below a confidence threshold, preventing low-confidence outputs from becoming downstream premises.</p>

    <p><strong>Result:</strong> Across 100 random seeds, the system reduced cascade contamination by ~78% in linear chains (length 15) and ~79% in branching trees (depth 4, branching factor 2). The false discovery rate dropped by ~69% in linear chains. A sensitivity analysis showed a sharp phase transition: at threshold 0.5, contamination drops by 98%.</p>

    <p><strong>Key insight:</strong> This is the reproducibility crisis in miniature, playing out at machine speed. The confidence scoring approach implements what I've called "quality-conditional settlement" in <a href="https://t46.github.io/blogs/research_automation.html" target="_blank" rel="noopener noreferrer">previous work on research infrastructure</a> &mdash; results are held in an uncertain state until reproduction evidence accumulates, like an escrow that releases only when verification conditions are met.</p>

    <p><a href="https://github.com/t46/epistemic-cascade-validator" target="_blank" rel="noopener noreferrer">GitHub: t46/epistemic-cascade-validator</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 LLM-Native Research Artifacts: Knowledge for machines</h3>

    <p><strong>Problem:</strong> Scientific knowledge is packaged for human consumption: natural language papers, visual figures, implicit assumptions. When AI agents are the primary readers, this format is a bottleneck. Research by <a href="https://arxiv.org/abs/2504.02601" target="_blank" rel="noopener noreferrer">AgentRxiv</a> showed that machine-optimized formats improve AI performance by 13.7% on reasoning benchmarks.</p>

    <p><strong>Approach:</strong> Define structured artifact schemas (Pydantic v2 models) where uncertainty, conditions, causation, and provenance are first-class citizens &mdash; not sentences buried in section 4.3 of a PDF. Build an agent interface with three operations: <code>query()</code> for structured Q&A, <code>compose()</code> for cross-artifact synthesis, and <code>diff()</code> for contradiction detection.</p>

    <p><strong>Result:</strong> The prototype includes two artifact types (experiment results and method comparisons), a Claude-powered converter that extracts structured data from paper text, and a benchmark framework for comparing AI performance on traditional vs. structured formats. A design document outlines future integration with the <a href="https://github.com/t46/ai-researcher-hub" target="_blank" rel="noopener noreferrer">AI Researcher Hub</a>.</p>

    <p><strong>Key insight:</strong> If we accept that AI agents will increasingly produce and consume research, then the unit of scientific communication should be redesigned for them. This doesn't mean abandoning human readability &mdash; structured artifacts can always be rendered for humans &mdash; but the primary representation should be machine-native.</p>

    <p><a href="https://github.com/t46/llm-native-research-artifacts" target="_blank" rel="noopener noreferrer">GitHub: t46/llm-native-research-artifacts</a></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;6 How the three connect</h3>

    <p>These experiments are complementary layers of the same stack:</p>

    <ul>
        <li><strong>Individual level</strong>: The Evolutionary Experiment Database selects and propagates good experiments within a population.</li>
        <li><strong>Chain level</strong>: The Epistemic Cascade Validator prevents unreliable results from corrupting downstream work.</li>
        <li><strong>Knowledge level</strong>: LLM-Native Research Artifacts ensure that when results do propagate, they carry structured uncertainty, conditions, and provenance that downstream agents can reason about.</li>
    </ul>

    <p>Together, they sketch an infrastructure layer for autonomous research that goes beyond "run experiments and log results." The goal is a system where quality emerges from the structure itself &mdash; where good results are amplified, bad results are contained, and knowledge flows in formats that machines can actually use.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;7 What's next</h3>

    <p>These are prototypes, not production systems. Each one tests a specific hypothesis:</p>

    <ul>
        <li>That evolutionary selection is a better curation mechanism than flat logging for autonomous research.</li>
        <li>That Bayesian confidence scoring can prevent cascade contamination without human review.</li>
        <li>That machine-native knowledge representations outperform human-readable formats for AI-to-AI communication.</li>
    </ul>

    <p>I plan to continue releasing experiments like these &mdash; open-source prototypes that explore what research infrastructure should look like when AI does the research. If you're working on similar problems, I'd love to <a href="https://x.com/takagi_shiro" target="_blank" rel="noopener noreferrer">hear from you</a>.</p>

    <p>All code is available on <a href="https://github.com/t46" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
</section>
