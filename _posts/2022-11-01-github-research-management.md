---
layout: post
title: "Managing Your Research on GitHub"
date: 2022-11-01
permalink: /blogs/github_research_management.html
---

<hr />
<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*poVqhn3nbvTSeNlajRO8yw.jpeg"><img
            src="https://cdn-images-1.medium.com/max/800/1*poVqhn3nbvTSeNlajRO8yw.jpeg" /></a>
    <figcaption>
        Photo by <a href="https://unsplash.com/@synkevych?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Roman Synkevych</a> on <a href="https://unsplash.com/s/photos/github?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
    </figcaption>
</figure>

<p>I am an independent researcher in machine learning. In
    this article, I will provide the idea of managing research on GitHub. I welcome your comments and
    suggestions on this thought.</p>

<hr />

<h3>Introduction</h3>

<p>Many researchers are willing to share their knowledge
    and collaborate with other researchers. I believe that by making it easier for researchers to share
    knowledge and contribute to the others' research, we can accelerate knowledge production.</p>

<p>One idea to make this possible is to manage research
    on GitHub. I know that experimental code is published on GitHub in some research community. On the other
    hand, I propose to manage all intermediate outputs of the research process on GitHub, from the
    determination of the research topic to the post-publication paper. Literally, all intermediate products,
    including information about how researchers found the literature, what they thought, what initial
    experiments they did, etc.</p>

<p>I believe there are several advantages to managing
    your research on GitHub. I will explain them one by one below.</p>

<hr />

<h3>1. GitHub clarifies contributors</h3>

<p>The first advantage is that managing research on
    GitHub clarifies who contributed and how. Suppose that all discussions and revisions of the manuscript
    are on GitHub. Then, the commit history can be traced to show who contributed to what part of the
    research process at a glance. Even if the authors' names are not listed in the paper, the history on
    GitHub makes it clear to everyone the appropriate allocation of credit for the research.</p>

<p>This might, for example, eliminate the gift-authorship
    problems. Or it may solve the problem of how to order author names in a collaborative research project.
    It may also address the plagiarism issue. This is because these are the problems that one's contribution
    is not recognized in the publication. I believe visualizing the contributions in the research process
    alleviates these problems.</p>

<h3>2. GitHub allows for finer contributions</h3>

<p>The second advantage is that on a more granular basis
    you can publish research results and contribute to research. For example, someone good at statistical
    analysis may be able to commit only to the statistical analysis part. Or someone good at writing may
    contribute to the paper writing. Also, citing a commit hash might make it possible to refer to specific
    ideas, results of experiments, problem formulation, etc. I believe this would allow researchers to
    utilize multiple talents more effectively in their research.</p>

<h3>3. GitHub improves reproducibility</h3>

<p>The third advantage is that it may lead to better
    reproducibility of research. Here, I will talk about machine learning, my field of expertise. As
    mentioned above, machine learning researchers publish their code on GitHub. However, information about
    the research process, such as "when it didn't work" and "what hyperparameters were important," is lost
    in the final repositories.</p>

<p>If you use the same settings as in the repository,
    there is no problem. However, if you change the code for your experiments, it sometimes does not work
    well. This means you should repeat the same process of searching for conditions the original proposer
    probably went through. In addition, many heuristics are not described or emphasized in the paper. I
    suspect this is due to the current pressure in the machine learning community to publish positive
    results to get into good international conferences. Publishing all intermediate thoughts and outputs of
    the research process would allow researchers to avoid making the same mistake twice.</p>

<p>In addition, logging research process may contribute
    to reducing questionable research practices. For example, it might be possible to reduce the number of
    HarKing by making it possible to compare the time stamp when the hypothesis was determined with the time
    stamp when the experimental results were obtained. I believe that these attempt could lead to more
    reproducible and transparent research practices.</p>

<p><a
        href="https://en.wikipedia.org/wiki/Replication_crisis"><strong>Replication crisis -
            Wikipedia</strong></a><a href="https://en.wikipedia.org/wiki/Replication_crisis"><em>The
            replication crisis (also called the replicability crisis and the reproducibility crisis) is an
            ongoing…</em></a><a href="https://en.wikipedia.org/wiki/Replication_crisis">en.wikipedia.org</a>
</p>

<h3>4. GitHub enables post-review</h3>

<p>The fourth advantage is that it may address the review
    crisis, which is also a problem in machine learning research. In machine learning research, there are
    not enough reviewers for the increasing number of researchers and papers. Because of an insufficient
    number of reviewers, non-experts often review. This results in the decline and variation in the quality
    of reviews.</p>

<p>To solve this problem, I believe it matters to adopt
    post-review. Post-review is an attempt to ensure the validity of papers by evaluating the results after
    publication. It enables research paper evaluation by many people over a long period.</p>

<p>I believe that managing the research on GitHub would
    help to achieve this post-review. You first place the LaTex file or markdown file of published paper on
    GitHub. Then, you accept corrections and comments on the file by pull request. This will allow more
    people to participate in the evaluation of the published paper at any time and in any form they wish.
</p>

<h3>5. GitHub embraces diversity</h3>

<p>The fifth advantage is that more diverse people can
    participate in a single research project. Open collaboration does not care who a person is, what
    institution they belong, or what their background is. It does not matter what race, social class, or
    educational background they have. I believe that research collaboration through GitHub will contribute
    to solving the diversity problem that many research communities are facing today.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*esMTdpx_VWZsz3wvXQeUIQ.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*esMTdpx_VWZsz3wvXQeUIQ.png" /></a>
<figcaption>
    Diversity is one of the important topics in top AI
    conferences (from <a href="https://nips.cc/Conferences/2019/DiversityInclusion">NeurIPS 2021</a>)
</figcaption>
</figure>

<h3>6. GitHub protects research ideas</h3>

<p>The sixth advantage is that more people may be able to
    publish unpublished content without fear of plagiarism. As mentioned above, a research log on GitHub
    shows who was thinking of what ideas and when. Therefore, even if a similar research idea appears later,
    you can track who states it first by checking the commit history. Therefore, more people are willing to
    share knowledge with others without fear of having their idea stolen by someone else. These are
    advantages I think research management on GitHub brings about.</p>

<hr />

<h3>Conclusion</h3>

<p>I would like to put as much of my future research as
    possible on the above framework. However, I am not very good at engineering, so I have yet to implement
    a meaningful prototype. So, if you share the above ideas and have engineering skills, I would like you
    to create more and more prototypes.</p>

<p>I believe that if engineers who are much better than I
    am could promote this kind of movement, it will accelerate research development. I would be happy to
    help these talents anytime in any way. I am also looking for people to work with me in these efforts, so
    if you are interested, please contact me!</p>
