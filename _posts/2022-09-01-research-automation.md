---
layout: post
title: "Toward Research Automation and Better Research System"
date: 2022-09-01
permalink: /blogs/research_automation.html
---

<hr />

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*X1zNxcjzEYmkq0OaC5140A.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*X1zNxcjzEYmkq0OaC5140A.png" /></a></figure>

<p>I am an independent researcher working on machine
    learning to realize an artificial researcher. In this article, I discuss what I believe should be done
    to advance research automation and research optimization. I wrote this article with the hope that it
    would reach those who are willing to work with me toward the world I am aiming for. So, if you are
    interested, I would be happy to hear from you! Let's work together!</p>

<hr />

<h3>Introduction</h3>

<p>My goal is to realize research automation and better
    research system. However, these require very long-term technological and intellectual development. So,
    these are not something that can be done by me alone.</p>

<p>I believe we can approach the realization of this goal
    only when more and more people today and in the future commit to this goal. Participation of as many
    people as possible who are interested in this goal, whether in research, engineering, business, design,
    or any other form, no matter what their background, will be an indispensable driving force for this
    goal. I would be happy if readers of this article share the proposed vision and join me in pursuing this
    goal. Let's do it together!</p>

<p>What I am interested in is not who realizes it but how
    to realize it. Therefore, I would also be happy if those actively researching/working in these fields
    other than me enjoy more support. So, I hope my activities will help the community and society as a
    whole to advance these movements more rapidly.</p>

<hr />

<h3>Toward research automation</h3>

<h3>Motivation</h3>

<p>I have always had a strong admiration and respect for
    research. I think it is cool to do whatever we can to get closer to understanding what we don't know. I
    also find the culture of sharing knowledge and approaching mysteries with the entire human race,
    transcending time and space, very appealing. I am interested in what is going on in the minds of
    researchers, what lies beyond the pursuit of this activity of research, and to what extent humanity will
    be able to approach the mysteries of the world through research.</p>

<p>I believe that one of the results of pursuing this
    research activity over the long term is research automation by autonomous artificial intelligence (I am
    sure that many people have similar ideas). From this purely intellectual interest, I would like to aim
    for the realization of an artificial researcher.</p>

<p>It is not difficult to imagine the unprecedented
    qualitative/quantitative leap in knowledge production occurs if artificial researchers could be
    realized. I believe that even partial automation could significantly impact society. Actually, many
    results have already begun to emerge. I hope to work with many people to realize this artificial
    researcher.</p>

<h3>Two approaches for research automation</h3>

<p>I believe there are two approaches to automating
    research. One is to create a general intelligence capable of doing research, and the other is to
    partially automate specific research tasks.</p>

<p>I believe that both of these are important and
    complementary. The former is necessary if we were to eventually create artificial researchers. However,
    I recognize that we are still at the stage where basic research with a view to the ultra-long-term
    realization of an artificial researcher is still required.</p>

<p>The latter is also very challenging. However,
    researchers have achieved several results. To name a few, DeepMind's AlphaFold, experimental condition
    search by Bayesian optimization, and automatic extraction of information from papers are well known.
    There have been attempts to automate even the writing of simple research papers. Other ambitious
    attempts are underway, such as having humanoid robots perform experiments.</p>

<p>I am committed to basic research aimed at
    general-purpose intelligence, partly because of my intellectual interests. At the same time, I believe
    that good guidelines for automation can only emerge from specific practices. So, I think it is essential
    to further promote research on specific research task automation. I have included some brief
    descriptions of research fields related to automation in the appendix. I hope interested parties will
    check it out.</p>

<p><a
        href="https://www.deepmind.com/research/highlighted-research/alphafold"><strong>AlphaFold</strong></a><a
        href="https://www.deepmind.com/research/highlighted-research/alphafold"><em>A system like AlphaFold
            which can accurately predict the structure of proteins is accelerating progress in many
            areas…</em></a><a
        href="https://www.deepmind.com/research/highlighted-research/alphafold">www.deepmind.com</a></p>

<h3>Softwarization of research</h3>

<p>I believe it is fundamental to represent the research
    process as a pipeline and software in both approaches. For example, in most hypothesis-testing research,
    the research process consists of determining an objective, finding an issue, generating a hypothesis,
    designing experiments, conducting experiments, and analyzing the results. We will represent each of
    these tasks in the flow as a module. Then, we will organize inputs, outputs, and any other restrictions
    for the module. This is like building a domain model of the research process. Based on that, we will
    build a pipeline by incorporating them into the code.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*VRNgKIij_E1buplsfO7G4g.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*VRNgKIij_E1buplsfO7G4g.png" /></a>
    <figcaption>
        Research process
    </figcaption>
</figure>

<h3>ResearchOps</h3>

<p>In machine learning, we build a pipeline representing
    each step in a machine learning project, from data collection to experimentation, deployment,
    maintenance, and operation, and to (semi-)automate each of these steps. The pipeline is divided into a
    Feature module for creating features, a Training module for learning, and so on. We call this automation
    MLOps. This allows for efficient execution of machine learning projects while reducing human error.</p>

<p>What I envision is creating a research version of
    MLOps (ResearchOps). MLOps is filled with know-how on experiment management, common in any empirical
    research. So, I think it is a good model from which we can learn a great deal in promoting the
    construction of research pipelines.</p>

<p>I believe that this kind of pipelining discussion is
    particularly advanced in companies. I would like to learn more about this area, and I would be happy if
    the findings become more and more public. If anyone is familiar with this area, I would be glad to learn
    more about it!</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/0*HVMbkhph4RA7iEeB"><img
            src="https://cdn-images-1.medium.com/max/800/0*HVMbkhph4RA7iEeB" /></a>
    <figcaption>
        <a
        href="https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning">Conceptual
        diagram of MLOps from Google Cloud</a>
    </figcaption>
</figure>

<h3>Benefits of research softwarization</h3>

<p>I believe that the benefits of converting research to
    the software are not limited to increasing production efficiency. One of the advantages is the
    possibility of reducing human error and QRP (Questionable Research Practice) by design without human
    effort by reducing the room for human intervention.</p>

<p>For example, HARKing, hypothesis generation after
    observing the results of an experiment, is a typical QRP. This is a violation of the order constraint:
    "hypothesis" was entered after the "result" has been entered. Suppose you disallow the researcher to
    enter "hypothesis" after "result" with an error message. Then, you might at least be able to reduce
    unintentional HARKing.</p>

<p>Furthermore, to express in code means that you can
    benefit from the efficiency knowledge that hackers have built up so far. I believe this is crucial to
    building a more optimal knowledge-producing system.</p>

<h3>Why we need pipelining</h3>

<p>You can easily imagine that when general intelligence
    enough to conduct research is realized, it will conduct research differently than it is today. Given
    this, one might wonder whether it is necessary to naively put current research practices into a pipeline
    (of course, it is necessary for bottom-up automation).</p>

<p>A reason I think pipelining matters is we are far
    behind in the realization of the artificial researcher. Pipelining is an intermediate goal to establish
    guidelines for what inductive bias (constraints to add to the model) we want the artificial intelligence
    to have. Without this, it will be difficult to define what is essential to the act of research and how
    it should be abstracted/implemented. I believe that by automating specific research tasks, we better
    understand what research is like. This makes the roadmap to the realization of artificial researchers
    clearer.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*BRTgMcjgE-3KtKp6_vYUBA.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*BRTgMcjgE-3KtKp6_vYUBA.png" /></a>
    <figcaption>
        I believe that the parallel progress of bottom-up
    research structuring/automation and fundamental research for the realization of artificial researchers
    will positively impact each other.
    </figcaption>
</figure>

<h3>Let's work together on research automation!</h3>

<p>I am currently engaged in basic research aimed at
    "creating a general intelligence enough to do research" in the long term. However, all of the above are
    essential topics, and the help of many people will be indispensable in promoting this.</p>

<p>For example, structuring the research process needs
    discussions in the philosophy of science. The construction of algorithms for automation requires the
    help of machine learning experts. And pipeline construction would not be possible without engineers. The
    knowledge of those familiar with business and law is also valuable. Therefore, I would be happy if as
    many people as possible get interested in this project and work together to make it a reality!</p>

<p>I am still a newcomer, but many people are already
    working on research automation. I would be happy if the number of people who support and cooperate with
    these people, even if it is not me increases, and if this research field becomes more energetic!</p>

<hr />

<h3>Toward better research system</h3>

<h3>My ideal research system</h3>

<p>I stated that I would like to realize a better
    research system. An ideal research system for me is that optimized for the
    production/maintenance/sharing of knowledge and that is available for those who want to do research to
    do so in good mental and physical health, regardless of their background or attributes. I am looking for
    people willing to work with me toward this goal as well! If this sounds at all interesting to you,
    please contact me!</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*JWtGMwLoAogcxCV9W5iuHw.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*JWtGMwLoAogcxCV9W5iuHw.png" /></a>
    <figcaption>
        I believe that an environment that is optimized for
    knowledge production/maintenance/sharing and where people who want to do research can do so in a healthy
    environment, both physically and mentally, regardless of their background or attributes, is desirable.
    </figcaption>
</figure>

<h3>Optimization of knowledge
    production/maintenance/sharing</h3>

<p>Research is a social activity involving various
    stakeholders. I view the activity of researchers to do research as a system that receives inputs and
    produces knowledge. The knowledge produced is used to produce the next piece of knowledge, so it flows
    recursively into the same system. Therefore, I believe that the optimization of research means improving
    the following quantitatively and qualitatively: 1. inputs to the system, 2. the system itself, and 3.
    output from the system.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*4zjhlwJXyyp4o9I_lPcYkg.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*4zjhlwJXyyp4o9I_lPcYkg.png" /></a>
    <figcaption>
        Research system.
    </figcaption>
</figure>

<p>Inputs to a knowledge production system are
    categorized into "people," "money," and "information (good)." In terms of "money," we should consider
    how to increase the inflow of funds from more diverse channels. For "people," you should increase the
    inflow of knowledge-producing and supporting ones while reducing the outflow.</p>

<p>Considering output from the knowledge production
    system is to consider maximizing the utilization of the produced knowledge. Since both topics of inputs
    and output are critical, I would like to write another article on them in the future.</p>

<h3>Optimization of a multi-layered knowledge production
    system</h3>

<p>I believe that the knowledge production system
    consists of multiple layers, such as individuals, laboratories, research institutions, and research
    ecosystems. My focus on research automation, which I explained above, referred to the automation of the
    research process at the individual level. Also, I was discussing those parts of the process directly
    involved in research. However, to optimize knowledge production, it matters to optimize hierarchies
    other than the individual level and to automate tasks that are not directly involved in research.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*BVTWJgLQrXM8uEn_MSYeNg.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*BVTWJgLQrXM8uEn_MSYeNg.png" /></a>
    <figcaption>
        I am focusing on optimizing the parts of the
    individual research process that are directly related to the research. Yet I believe that optimizing the
    other layers of the hierarchy is also imperative.
    </figcaption>
</figure>

<p>For example, on a laboratory basis, university
    laboratories have laboratory management tasks such as research guidance, funding acquisition, and
    research project management. The issue is to optimize these, especially to make them de-personalized and
    shared knowledge.</p>

<p>A university PI (laboratory boss) becomes a PI based
    on their research performance. Nevertheless, once they become a PI, they should provide education,
    research guidance, management, administration, and university office work. It is easy to imagine that
    this can cause a skill mismatch.</p>

<h3>Optimization of the activity of not research</h3>

<p>Next, let's talk about automating tasks that are not
    directly related to research. According to a 2018 survey on the breakdown of university faculty activity
    time in Japan, it is reported that university faculty spend about 30% to 50% of their time actually
    devoted to research work. The remaining 50-70% is occupied by tasks such as teaching, various
    administrative procedures, and writing budget applications. Given the goal of optimizing knowledge
    production systems, the impact of automating these non-research tasks will be large.</p>

<p>Since this is the automation of tasks that are not
    necessarily unique to research, you can more directly benefit from DX knowledge in other industries. In
    this sense, if as many people on the business side who have this knowledge could cooperate with us, we
    may be able to make great progress in improving research efficiency.</p>

<p>Results of a survey by Rahenau Instituut on the
    research time of Dutch researchers also indicate that researchers devote much of their time to
    activities outside of research.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*F9eDch1iJ6b_5eZWjzD1UA.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*F9eDch1iJ6b_5eZWjzD1UA.png" /></a>
    <figcaption>
        <a
        href="https://www.mext.go.jp/b_menu/houdou/31/06/__icsFiles/afieldfile/2019/06/26/1418365_01_3_1.pdf">Time
        commitment of researchers as a percentage of total working</a><a
        href="https://www.mext.go.jp/b_menu/houdou/31/06/__icsFiles/afieldfile/2019/06/26/1418365_01_3_1.pdf">time
        (Japan, modified)</a>
    </figcaption>
</figure>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*JKpkc-OfggeFMVxVajg5WQ.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*JKpkc-OfggeFMVxVajg5WQ.png" /></a>
    <figcaption>
        <a
        href="https://www.rathenau.nl/en/vitale-kennisecosystemen/what-motivates-researchers">Time
        commitment of researchers as a percentage of total working</a><a
        href="https://www.rathenau.nl/en/vitale-kennisecosystemen/what-motivates-researchers">time
        (Netherlands)</a>
    </figcaption>
</figure>

<h3>Let's work together on research optimization!</h3>

<p>I cannot personally advance against all of these, as
    it matters to focus on the problem to commit to for promoting projects. However, these are all
    inevitable issues, and we should solve them as quickly as possible. Therefore, I would like to help
    those working in these fields. I hope we can all work together to build a more optimal research system!
</p>

<h3>A research environment in which those who wish to
    conduct research can do so in a physically and mentally healthy manner, regardless of their background
    or attributes</h3>

<p>I believe the research environment should be favorable
    for people to spend time. Specifically, I think a research environment should be where anyone can
    conduct research in good health mentally and physically, regardless of their backgrounds or attributes.
</p>

<p>I have basically written what I want to tell you about
    this in another article, so I will not write much about it this time. If you are aware of similar
    issues, I would be happy if we could discuss about this issue.</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/0*zOCClrsxoxREkqzZ"><img
            src="https://cdn-images-1.medium.com/max/800/0*zOCClrsxoxREkqzZ" /></a>
    <figcaption>
        The report that graduate students surveyed were nearly
    six times more mentally unhealthy than normal (note that this was not a random sampling): <a
        href="https://www.nature.com/articles/nbt.4089">Evans et al. 2018 Evidence for a mental health
        crisis in graduate education</a>.
    </figcaption>
</figure>

<p>I believe it is important to expand the research
    community outside of the existing research ecosystem to alleviate this problem in the long term. So I am
    working to advance that by adopting a systems-oriented solution approach.</p>

<p>On the other hand, it is also true that this does not
    provide a prescription for the issue at hand. Also, I believe it is equally important to solve these
    issues through a political approach. Therefore, I sincerely support those struggling in these areas. I
    would be happy to help them as far as I can.</p>

<p>Otherwise, if you have experienced something painful
    or unacceptable in your research, please do not hesitate to contact me. It may not be an immediate
    solution to your problem, but I believe I can help in some way. I hope to reduce the number of people
    who like research but have come to dislike it or have had to leave the research community. I hope we can
    all work together to expand a more comfortable research environment!</p>

<hr />

<h3>I'm looking for a fellow working on a new style of
    research!</h3>

<h3>I'll help those interested in becoming independent
    researchers!</h3>

<p>As I mentioned above, I believe it will be positive
    for the entire research ecosystem in the long run if the research field flourishes outside of the
    current research ecosystem. This is one of the reasons I am doing independent research. So I hope that
    more researchers will become independent or do research in a new style. If you are interested in being
    an independent researcher or want to try various research styles, I would be happy to help you. Please
    contact me by all means!</p>

<p>My specialty is machine learning, so I have been able
    to do my research individually with little hindrance. Also, I have been blessed with wonderful friends
    giving me a job. So my methods may not be very reproducible. However, I may be able to share what I know
    in my own way, or I may be able to introduce you to a job if the conditions are right for you. Many
    people have been doing research on their own for a long time. Even if I can't do something directly, I
    may be able to introduce information about how they are living their lives.</p>

<p>I think some people want to do your research yourself.
    Some might have had a hard time in the current lab. Others may be temporarily freelancing until they get
    their next position. If any of those people are interested, feel free to contact me!</p>

<h3>I'm looking for people to try different research
    methods with!</h3>

<p>As I have written in other articles, I would like to
    manage the entire research process on GitHub. Besides that, there are many other things I would like to
    do. For example, I would like to conduct research with a full-fledged project manager, or create a DAO
    to conduct research. I would like to explore various research styles by running a hypothesis testing
    cycle.</p>

<p>I'm going to do these even on my own. But I think it
    is more fun to work together so that we can come up with new ideas and try out ideas that I cannot do
    alone. So I am also looking for researchers interested in trying out new research methods together! I
    believe the next generation of research will emerge from this kind of bottom-up trial-and-error process.
    Let's all try different ways of doing research!</p>

<p>Some people are interested in this kind of thing but
    cannot do it due to restrictions in their position or research field. In such cases, I would be happy to
    just hear your ideas. As a person free to do various things at my discretion, I would like to try out
    the ideas for those people!</p>

<hr />

<h3>Conclusion</h3>

<p>I have written this article hoping that as many people
    as possible will be interested in research automation and better research system. I would be happy if
    some of you join me to pursue these goals.</p>

<p>I have already expanded the scope of this article
    considerably. Before I end this article, let me expand it just a little bit more.</p>

<h3>My ultimate goals</h3>

<p>I'm interested in how much of the unknown of this
    world can be made known. In other words, I am interested in and aim for a world in which we can make as
    much of this world's unknowns known as quickly as possible.</p>

<p>To that end, I believe it is necessary to 1. improve
    knowledge production, 2. update the human ability to comprehend, and 3. aim for the perpetuation of
    humans by transplanting them into machines. 1 is the part I have described so far. I intend to
    contribute to the realization of the above world by committing myself to this.</p>

<p>The autonomous artificial researcher I want to aim for
    in 1 is the kind of being that will overcome humanity. Thus, I hope that 2 and 3 will progress so that
    even after their emergence, humans can still enjoy understanding knowledge. So, I wholeheartedly support
    anyone working on 2 or 3! If there's anything I can do for you, please feel free to contact me anytime!
</p>

<figure class="image"><a
        href="https://cdn-images-1.medium.com/max/800/1*hiMyldEsveIj0aLxduf27A.png"><img
            src="https://cdn-images-1.medium.com/max/800/1*hiMyldEsveIj0aLxduf27A.png" /></a>
    <figcaption>
        Those are essentia for my ultimate goal.
    </figcaption>
</figure>

<p>I understand that any goal is the result of steady
    daily work and the accumulation of concrete results. I still have a long way to go to reach my goal, but
    I would like to keep being down-to-earth and solve specific issues one by one, starting from where I
    can.</p>

<h3>Appendix</h3>

<p>Many efforts have already been made regarding the
    automation/optimization of research. Only a few of them are presented here for your reference. I also
    include what I believe is relevant. I have not been able to cover all of them, but I hope to do a more
    comprehensive summary at some point.</p>

<h3>Understanding research</h3>

<p><em><strong>Philosophy of
            science</strong></em><strong>: </strong>This is a branch of philosophy that covers science. It
    is not directly related to automation, but I believe it provides a useful perspective for formalizing
    research. Since I am not a specialist, I often study by the <a
        href="https://plato.stanford.edu/">Stanford Encyclopedia of Philosophy</a>, which fits beginners (<a
        href="https://plato.stanford.edu/entries/scientific-method/">Scientific Method</a>, <a
        href="https://plato.stanford.edu/entries/confirmation/">Confirmation</a>, <a
        href="https://plato.stanford.edu/entries/scientific-discovery/">Scientific Discovery</a>, etc.).</p>

<p><em><strong>Science of Science</strong></em>: This is
    the field of scientific analysis of a wide range of topics related to research, such as networks of
    scientists, citation dynamics, and the careers of scientists based on data. <a
        href="https://barabasi.com/">Dr. Barabasi</a> of Network Science, who also wrote the book <a
        href="https://www.amazon.com/Science-Dashun-Wang-dp-1108716954/dp/1108716954/ref=mt_other?_encoding=UTF8&amp;amp;amp;amp;amp;amp;amp;amp;me=&amp;amp;amp;amp;amp;amp;amp;amp;qid=">The
        Science of Science</a>, is well known in this field.</p>

<p><em><strong>Science, technology and
            society</strong></em>: I understand that this is a field that studies science as a social
    activity. It deals with a wide range of issues from social scientific analysis of the impact of society
    on science to the ethics of scientists.</p>

<h3>Research automation</h3>

<p><em><strong>Laboratory automation</strong></em>: This
    is a general term for automation of research-related activities such as experiments, analysis, and
    research life. For example, <a href="https://www.nature.com/articles/s41467-019-13189-z">Dr. HamediRad
        and his colleagues successfully learned the ML model to make a single-arm robot search autonomously
        for combinations of microbial gene sequences</a>.</p>

<p><em><strong>AI for Science</strong></em>: This is a
    study that uses machine learning to replace processes in science. This seems to be one of the most
    exciting research areas these days. As mentioned above, some studies use Bayesian optimization to search
    for experimental conditions, deep neural networks to predict protein structure, parameter estimation for
    theoretical models, etc. I have the impression that DeepMind, famous for AlphaGo, is trying to advance
    this on a large scale. Like DeepMind, I believe that attention is being paid to how machine learning can
    be used for scientific discovery.</p>

<p><em><strong>Automated theorem proving</strong></em>:
    It is an attempt to automate mathematical proofs by computer. In particular, methods that combine
    conventional automatic proofs of theorems with machine learning have emerged in recent years. Czech
    researcher <a href="http://cs.ru.nl/~urban/">Dr. Josef Urban</a> and his colleagues have led the field
    from the early stages. In recent years <a
        href="https://link.springer.com/chapter/10.1007/978-3-030-79876-5_2">researchers from Google</a> and
    other companies have entered the field. The AITP international conference is small but gathers the
    latest research in this research field.</p>

<p><em><strong>Solving/Discovering equations by neural
            networks</strong></em>: It is an attempt to make the current neural network solve and discover
    equations. I am not familiar with it, but <a
        href="https://www.science.org/doi/10.1126/sciadv.aay2631">AI Feynman</a> is one of the names I have
    heard.</p>

<p><em><strong>AutoML</strong></em>: Machine learning
    automation. It includes the automation of hyperparameter exploration and neural network architecture
    exploration. Companies seem to be making great progress. In research, I have the impression that <a
        href="https://www.automl.org/">Dr. Frank Hutter and his colleagues</a> are leading the research
    area.</p>

<p><em><strong>Automation for paper survey and
            writing</strong></em>: This is a research project that focuses on the extraction of information
    from papers, the acquisition of relevant research, summarization, and writing. I feel that COVID-19 has
    increased the need for automated acquisition of information from papers. I have seen a lot of
    COVID-related research emerge. I have the impression that <a
        href="https://allenai.org/allennlp">AllenNLP</a> has been doing a great job recently in this area of
    applying AI.</p>
