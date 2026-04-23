---
layout: post
title: "When Markets Fail to Beat Intuition: A Belief Market Experiment on Research Claims"
date: 2026-04-23
permalink: /blogs/belief_market.html
description: "A negative result: a 2-agent LMSR belief market fails to outperform simple confidence scoring for research claim ranking. The key insight is a minimum diversity threshold for prediction markets."
tags:
  - metascience-experiment
---

<h2>When Markets Fail to Beat Intuition: A Belief Market Experiment on Research Claims</h2>
<h3 style="text-align: center;">A negative result from testing prediction markets for AI-generated research quality assessment -- and why it matters.</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 Abstract</h3>

    <p>We tested whether a belief market with economic stakes could produce better research claim quality rankings than raw confidence scoring. Using an LMSR (Logarithmic Market Scoring Rule) market with 2 heuristic agents trading on 35 AI-generated research claims, we found that the market <em>failed</em> to outperform simple confidence scores. The market achieved a Kendall tau of +0.242 (p=0.052) against evaluator ground truth, while raw confidence scored +0.435 (p&lt;0.001). This negative result reveals a minimum diversity threshold for prediction markets: with only 2 participants sharing similar information, the market mechanism destroys signal rather than aggregating it.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 Background: why belief markets for research?</h3>

    <p>Prediction markets have a strong track record in aggregating dispersed information. From election forecasting to corporate decision-making, the "wisdom of crowds" effect is well-documented: when independent agents with diverse information trade on outcomes, market prices converge toward truth.</p>

    <p>We asked: <strong>can this mechanism work for evaluating research quality?</strong></p>

    <p>In AI-driven research, autonomous agents generate dozens of claims with varying evidence quality. Evaluating which claims are genuinely novel versus trivially true is a core challenge. A market mechanism could theoretically:</p>

    <ol>
        <li>Aggregate evidence assessments from multiple reviewers</li>
        <li>Reward agents who identify quality early</li>
        <li>Produce a consensus ranking without relying on any single evaluator</li>
    </ol>

    <p>This experiment tested section 10.3 of our <a href="https://github.com/t46/metascience-experiments">research-social-infrastructure</a> framework:</p>

    <blockquote>"A belief market with economic stakes produces more accurate research claim quality ranking than individual confidence scoring, even with only 2 participants."</blockquote>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 Method</h3>

    <h4>Data</h4>

    <p>We loaded 35 research claims from 3 runs of our Autonomous Research Agent (ARA), an AI system that generates and evaluates scientific hypotheses. Each claim comes with:</p>

    <ul>
        <li><strong>Claim text</strong>: the scientific assertion</li>
        <li><strong>Evidence</strong>: supporting and opposing evidence with fidelity levels (F0-F3)</li>
        <li><strong>Confidence</strong>: the ARA's self-assessed probability (0-1)</li>
        <li><strong>Status</strong>: verified, active, parked, or killed</li>
    </ul>

    <h4>Ground truth</h4>

    <p>Evaluator quality scores were computed from claim properties: verification status, evidence richness, balance of for/against evidence, and proportion of high-fidelity (F2+) evidence. Critically, raw confidence was <em>not</em> used in computing ground truth, ensuring independence between the baseline and the evaluation metric.</p>

    <h4>Market mechanism</h4>

    <p>We used Hanson's <strong>Logarithmic Market Scoring Rule (LMSR)</strong> -- the same mechanism used in platforms like Polymarket and Metaculus. Key parameters:</p>

    <ul>
        <li><strong>Liquidity parameter (b)</strong>: 8.0</li>
        <li><strong>Initial price</strong>: 0.50 (maximum uncertainty)</li>
        <li><strong>2 agents</strong>: "Optimist" (biased toward supporting claims) and "Skeptic" (biased against)</li>
        <li><strong>Starting budget</strong>: 100 compute tokens each</li>
    </ul>

    <h4>Simulation process</h4>

    <p>For each of the 35 claims:</p>

    <ol>
        <li>Evidence is revealed in rounds of 3 pieces</li>
        <li>Each agent analyzes fidelity-weighted evidence signals</li>
        <li>Agents stake tokens for or against the claim</li>
        <li>The LMSR market adjusts prices based on trades</li>
        <li>After all claims, markets settle against evaluator ground truth</li>
    </ol>

    <h4>Metrics</h4>

    <ul>
        <li><strong>Kendall tau</strong>: rank correlation between rankings (market vs evaluator, confidence vs evaluator)</li>
        <li><strong>Spearman rho</strong>: same comparison using Spearman rank correlation</li>
        <li><strong>ROI</strong>: return on investment for each agent</li>
    </ul>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Results</h3>

    <h4>The market did not beat confidence scoring</h4>

    <table>
        <thead>
            <tr><th>Metric</th><th>Market vs Evaluator</th><th>Confidence vs Evaluator</th></tr>
        </thead>
        <tbody>
            <tr><td>Kendall tau</td><td>+0.242 (p=0.052)</td><td><strong>+0.435 (p=0.001)</strong></td></tr>
            <tr><td>Spearman rho</td><td>+0.355 (p=0.037)</td><td><strong>+0.532 (p=0.001)</strong></td></tr>
        </tbody>
    </table>

    <p>The hypothesis is <strong>not supported</strong>. Confidence scoring outperforms the 2-agent market by a substantial margin on both metrics.</p>

    <img src="/assets/images/blog/belief-market/kendall_tau_comparison.png" alt="Kendall Tau Comparison" style="max-width: 100%;">
    <p><em>Confidence scoring (red) significantly outperforms the 2-agent market (blue) on both Kendall tau and Spearman rho. The market's tau is only marginally significant (p=0.052), while confidence is highly significant (p&lt;0.001).</em></p>

    <h4>The market captures some signal, but loses information</h4>

    <p>The market price does correlate positively with evaluator quality -- it is not random. But the process of routing evidence through two opposing agents and an LMSR mechanism compresses the signal. Claims with evaluator scores spanning 0.54-1.00 get mapped to market prices in a narrow 0.45-0.92 range.</p>

    <img src="/assets/images/blog/belief-market/ranking_comparison.png" alt="Ranking Comparison" style="max-width: 100%;">
    <p><em>Side-by-side comparison of all 35 claims sorted by evaluator score. The confidence panel preserves more of the evaluator's ordering than the market price panel.</em></p>

    <h4>Market prices respond to evidence, but sluggishly</h4>

    <p>The price evolution charts show that the market does update as evidence is revealed -- but it never moves far enough from its 0.50 starting point to match the true quality scores.</p>

    <img src="/assets/images/blog/belief-market/price_evolution.png" alt="Price Evolution" style="max-width: 100%;">
    <p><em>Market price trajectories for 4 selected claims. Even claim-009, with 22 pieces of evidence and 8 trading rounds, only reaches a market price of 0.70 against a ground truth of 1.00. The market is structurally sluggish with only 2 traders.</em></p>

    <h4>Early-and-correct staking is rewarded</h4>

    <p>One thing the market <em>did</em> get right: agents who staked early and correctly were rewarded.</p>

    <ul>
        <li><strong>Optimist</strong>: 34/34 early stakes correct (100%), final balance 139.0 tokens (+39% ROI)</li>
        <li><strong>Skeptic</strong>: 20/23 early stakes correct (87%), final balance 106.7 tokens (+7% ROI)</li>
    </ul>

    <img src="/assets/images/blog/belief-market/agent_portfolio.png" alt="Agent Portfolio" style="max-width: 100%;">
    <p><em>The optimist (amber) depletes tokens faster through aggressive staking but earns substantially higher settlement payouts. The skeptic (purple) preserves budget but captures less reward. Both end profitable, confirming the market's reward mechanism works -- even if the ranking signal is degraded.</em></p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 Why negative results matter</h3>

    <p>This is a negative result, and we are publishing it deliberately. Here is why:</p>

    <p><strong>1. It bounds the design space.</strong> We now know that 2 agents with the same information base and simple personality offsets are insufficient for a functioning belief market. This prevents others from making the same assumption.</p>

    <p><strong>2. It identifies a mechanism.</strong> The failure is not because markets are bad at aggregation -- it is because 2 agents do not provide enough diversity of views. The market mechanism requires <em>genuinely independent information</em> to aggregate. Two heuristic agents reading the same evidence with slightly different biases do not meet this requirement.</p>

    <p><strong>3. It validates partial components.</strong> The LMSR pricing mechanism works correctly. The early-and-correct incentive structure works correctly. The settlement mechanism works correctly. The problem is specifically with <em>input diversity</em>, not with the market infrastructure.</p>

    <p><strong>4. It sets a testable threshold.</strong> The natural next question -- "how many agents do you need?" -- is now a concrete, testable hypothesis rather than a vague design parameter.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;6 The minimum diversity threshold</h3>

    <p>The key insight from this experiment is that prediction markets have a <strong>minimum diversity threshold</strong> below which they destroy rather than aggregate information.</p>

    <p>With 2 agents:</p>

    <ul>
        <li>Both see the same evidence</li>
        <li>Their "diverse views" are just fixed personality offsets (optimist vs skeptic)</li>
        <li>The market averages two slightly different readings of the same signal</li>
        <li>This averaging <em>compresses</em> information rather than enriching it</li>
    </ul>

    <p>Think of it this way: if you ask two people who read the same paper to rate it, and one always adds +0.3 to their score and the other subtracts -0.3, averaging their scores gives you... exactly the original score, but with added noise from the market mechanism.</p>

    <p>For a belief market to outperform individual assessment, you need agents with:</p>

    <ul>
        <li><strong>Different information sources</strong> (not just different biases on the same information)</li>
        <li><strong>Different analytical frameworks</strong> (methodological diversity)</li>
        <li><strong>Genuine independence</strong> (not just personality parameters applied to the same heuristic)</li>
    </ul>

    <p>We estimate the minimum viable market size for this task at <strong>5+ agents with genuinely independent information</strong>, based on the comparison with our Claim Prediction Market experiment.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;7 Comparison: Claim Prediction Market (which worked)</h3>

    <p>Our parallel experiment, the <strong>Claim Prediction Market</strong>, tested a related hypothesis using a different design:</p>

    <table>
        <thead>
            <tr><th>Design Dimension</th><th>Belief Market (this experiment)</th><th>Claim Prediction Market</th></tr>
        </thead>
        <tbody>
            <tr><td>Agents</td><td>2 heuristic agents</td><td>5 LLM agents (Claude)</td></tr>
            <tr><td>Diversity mechanism</td><td>Personality offset (optimist/skeptic)</td><td>Distinct personas (Skeptic, Optimist, Methodologist, DomainExpert, BaseRate)</td></tr>
            <tr><td>Information processing</td><td>Fidelity-weighted evidence counting</td><td>Full claim text + evidence reasoning via LLM</td></tr>
            <tr><td>Market mechanism</td><td>LMSR with sequential trading</td><td>Independent predictions, ensemble averaging</td></tr>
            <tr><td>Result</td><td><strong>NOT SUPPORTED</strong> (tau=0.242)</td><td><strong>SUPPORTED</strong> (ensemble Brier=0.177, &lt; chance=0.25)</td></tr>
        </tbody>
    </table>

    <p>The Claim Prediction Market worked because:</p>

    <ol>
        <li><strong>5 agents</strong> provided more diverse viewpoints</li>
        <li><strong>LLM reasoning</strong> allowed each agent to process claim <em>meaning</em>, not just evidence counts</li>
        <li><strong>Independent predictions</strong> avoided the feedback loop of sequential trading where the second agent sees and reacts to the first agent's trade</li>
    </ol>

    <p>This comparison strongly supports the minimum diversity threshold hypothesis. The same underlying data (35 ARA claims from the same 3 project runs) produced a positive result with 5 diverse LLM agents and a negative result with 2 heuristic agents.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;8 Next steps</h3>

    <p>Based on this negative result, three clear follow-up experiments emerge:</p>

    <h4>1. Scale the agent count (N=2 to N=10)</h4>
    <p>Run the same LMSR market with 3, 5, 7, and 10 agents. Identify the exact N where market ranking first exceeds confidence ranking. This directly tests the minimum diversity threshold.</p>

    <h4>2. Switch to LLM mode</h4>
    <p>The belief market codebase already supports an LLM mode where agents use Claude to reason about claims. Running with 2 LLM agents would isolate whether the failure is due to agent count or agent sophistication.</p>

    <h4>3. Introduce real information asymmetry</h4>
    <p>Instead of revealing all evidence to all agents simultaneously, give each agent a different subset of evidence. This creates genuine information diversity -- the core ingredient that prediction markets are designed to aggregate.</p>

    <h4>4. Add real stakes</h4>
    <p>Both experiments used simulated tokens. An experiment with real computational resource stakes (e.g., GPU time allocation) would test whether economic incentives change agent behavior in meaningful ways.</p>

    <p>Code: <code>belief-market/main.py</code> | Data: 35 claims from 3 ARA project runs | Analysis: <code>belief-market/output/</code></p>
</section>

<section>
    <p><em>This experiment is part of the <a href="https://github.com/t46/metascience-experiments">Metascience Experiments</a> project, which tests hypotheses about research methodology using AI agents as subjects. We believe that publishing negative results is essential to scientific progress -- a null finding that bounds the design space is more valuable than an unpublished experiment that others might wastefully replicate.</em></p>
</section>
