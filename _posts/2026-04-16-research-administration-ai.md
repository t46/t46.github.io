---
layout: post
title: "AI for Research Administration: The Efficiency Gap Nobody Is Closing"
date: 2026-04-16
permalink: /blogs/research_administration_ai.html
description: "Everyone talks about AI for research. But research administration — policy tracking, grant writing, reporting — remains manual and fragmented. Two open-source prototypes explore what AI-driven research admin could look like."
tags:
  - metascience-experiment
---

<h2>AI for Research Administration: The Efficiency Gap Nobody Is Closing</h2>
<h3 style="text-align: center;">Everyone is automating the science. Who is automating the paperwork?</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The overlooked half of research</h3>

    <p>The conversation around AI and science has focused almost entirely on the research process itself &mdash; hypothesis generation, experiment design, data analysis, paper writing. Projects like <a href="https://sakana.ai/ai-scientist/" target="_blank" rel="noopener noreferrer">AI Scientist</a> and <a href="https://github.com/karpathy/autoresearch" target="_blank" rel="noopener noreferrer">autoresearch</a> are pushing the frontier of what AI can do <em>as</em> a researcher.</p>

    <p>But research does not happen in a vacuum. Behind every funded project is a grant application someone spent weeks writing. Behind every active lab is someone tracking policy changes from funding agencies, monitoring call deadlines, compiling progress reports, and navigating bureaucratic systems that were designed decades ago. This is <strong>research administration</strong> &mdash; and it is essential to the entire enterprise of science.</p>

    <p>In Japan alone, universities employ research administrators (URA: University Research Administrators) whose daily work includes monitoring announcements from MEXT, JST, JSPS, and other agencies; preparing KAKENHI applications; managing budgets across funding sources; and writing progress reports. Much of this work is repetitive, information-heavy, and ripe for automation &mdash; yet it remains almost entirely manual.</p>

    <p>If we are serious about improving research productivity, this is a gap worth closing. Not because administrative work is unimportant &mdash; quite the opposite. It is <em>so</em> important that we should not accept it being done inefficiently.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 The problem is fragmentation</h3>

    <p>Consider what a research administrator does on a typical morning: check the MEXT website for new announcements, scan JST's RSS feed for open calls, browse JSPS for KAKENHI updates, look at NEDO and AMED for cross-disciplinary opportunities. Each agency publishes information on its own website, in its own format, on its own schedule. There is no unified feed.</p>

    <p>The same fragmentation applies to institutional knowledge. Every university's research support office has accumulated expertise &mdash; which sections of a KAKENHI application reviewers focus on, how to structure a budget across fiscal years, what the e-Rad system's quirks are. But this knowledge lives in individual heads or local documents. When an experienced administrator retires, it often leaves with them.</p>

    <p>These are not hard technical problems. They are coordination problems that AI is well-positioned to help with. And yet, while "AI for Science" attracts billions in funding, "AI for the people who make science possible" barely registers as a category.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 Two prototypes</h3>

    <p>To explore what AI-driven research administration could look like, I built two open-source prototypes. They are minimal &mdash; each was built in under an hour &mdash; but they demonstrate that the building blocks already exist.</p>

    <h4>Prototype 1: Automated Policy Collection</h4>

    <p><a href="https://github.com/t46/ra-policy-collector" target="_blank" rel="noopener noreferrer">ra-policy-collector</a> automatically collects policy announcements from major Japanese science funding agencies. Currently two sources are active:</p>

    <ul>
        <li><strong>MEXT</strong> (Ministry of Education): HTML scraping of the public call page, used under the <a href="https://www.mext.go.jp/b_menu/1351168.htm" target="_blank" rel="noopener noreferrer">Government Standard Terms of Use 2.0</a> &rarr; 63 items collected</li>
        <li><strong>JST</strong> (Japan Science and Technology Agency): official RSS feed parsing &rarr; 25 items collected</li>
    </ul>

    <p>Each item is normalized into a structured format (title, URL, source, date, category) and stored as JSON. The system detects new items by comparing against the previous collection, and generates a daily Markdown report. A GitHub Actions workflow runs the collector every morning at 9:00 JST.</p>

    <p>88 items from a single run across two agencies. That is dozens of pages a research administrator no longer needs to visit manually. The system is extensible &mdash; adding JSPS, NEDO, AMED, Cabinet Office CSTI, or e-Rad is a matter of writing a new collector function and registering it, provided the target site's terms of use permit automated access.</p>

    <p>This is not sophisticated AI. It is basic scraping and structuring. But that is precisely the point: <strong>the bar for meaningful automation in research administration is low</strong>, because the current baseline is "a person visiting government websites every morning."</p>

    <h4>Prototype 2: RA Skills Hub</h4>

    <p><a href="https://github.com/t46/ra-skills" target="_blank" rel="noopener noreferrer">ra-skills</a> takes a different approach: instead of automating a specific task, it structures research administration <em>expertise</em> as reusable AI skills. Built on Claude Code's skill format, the repository contains 8 skills covering common RA workflows:</p>

    <ul>
        <li><code>/policy-monitor</code> &mdash; Aggregate and summarize policy updates from multiple agencies</li>
        <li><code>/funding-search</code> &mdash; Search and filter open calls from e-Rad, JSPS, JST, AMED</li>
        <li><code>/grant-proposal-review</code> &mdash; Review grant applications against agency-specific criteria</li>
        <li><code>/budget-planning</code> &mdash; Draft research budgets with proper cost categories and co-funding rules</li>
        <li><code>/progress-report</code> &mdash; Generate progress report templates with achievement descriptions</li>
        <li><code>/research-metrics</code> &mdash; Collect and visualize bibliometric indicators</li>
        <li><code>/erad-guide</code> &mdash; Step-by-step guidance for the e-Rad system</li>
        <li><code>/create-ra-skill</code> &mdash; A meta-skill that helps RAs convert their own expertise into new skills</li>
    </ul>

    <p>The last one is the most interesting. <code>/create-ra-skill</code> interviews a research administrator about their workflow through structured dialogue, then generates a new skill file that other institutions can use. This is a mechanism for <strong>turning tacit RA knowledge into shareable, executable format</strong>.</p>

    <p>The vision is a community-maintained repository where research administrators across institutions contribute their expertise as skills &mdash; effectively crowdsourcing the operational knowledge of the research support ecosystem.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Why this matters for research capacity</h3>

    <p>The impact of research administration efficiency is easy to underestimate. But consider: every hour a PI spends navigating a funding portal is an hour not spent on research. Every week a research administrator spends manually compiling policy updates is a week that could be spent on strategic planning for their institution's research portfolio.</p>

    <p>Improving research capacity is not only about making researchers more productive. It is also about making the <em>systems that support research</em> more productive. Better administration means researchers hear about relevant funding opportunities earlier, submit stronger applications because they had better support, and spend less time on reporting compliance.</p>

    <p>Japan's URA system was introduced to professionalize research support, and it has been a meaningful step. But the tools available to URAs have not kept pace. Many still rely on manual web monitoring, Word templates, and institutional memory. If we gave research administrators the same level of AI tooling that we are building for researchers themselves, the compounding effect on national research output could be substantial.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 The broader opportunity</h3>

    <p>These two prototypes barely scratch the surface. Research administration includes:</p>

    <ul>
        <li><strong>Grant lifecycle management</strong> &mdash; from opportunity discovery through application, award management, reporting, and audit</li>
        <li><strong>Compliance and ethics</strong> &mdash; IRB submissions, conflict of interest declarations, data management plans</li>
        <li><strong>Research evaluation</strong> &mdash; institutional self-assessment, benchmarking, impact narrative construction</li>
        <li><strong>International collaboration</strong> &mdash; MOU tracking, joint funding scheme navigation, cross-border compliance</li>
        <li><strong>Knowledge management</strong> &mdash; preserving and transferring institutional expertise across staff transitions</li>
    </ul>

    <p>Each of these areas has automation potential that no one is systematically pursuing. The autoresearch community is building increasingly sophisticated systems for AI-driven experimentation. Meanwhile, the administrative infrastructure that makes funded research possible is still running on spreadsheets and manual web checks.</p>

    <p>I do not think this requires a grand coordinated effort. As these prototypes show, individual tools can be built quickly and provide immediate value. What it requires is for people to <em>notice the gap</em> &mdash; to recognize that "AI for research" should include "AI for the people and processes that enable research to happen."</p>

    <p>Both prototypes are open source. If you work in research administration or research support, I would be glad to <a href="https://x.com/takagi_shiro" target="_blank" rel="noopener noreferrer">hear what problems you face daily</a> &mdash; the next prototype might address one of them.</p>

    <ul>
        <li><a href="https://github.com/t46/ra-policy-collector" target="_blank" rel="noopener noreferrer">ra-policy-collector</a> &mdash; automated science policy monitoring for Japanese funding agencies</li>
        <li><a href="https://github.com/t46/ra-skills" target="_blank" rel="noopener noreferrer">ra-skills</a> &mdash; community-driven research administration skills for AI assistants</li>
    </ul>
</section>
