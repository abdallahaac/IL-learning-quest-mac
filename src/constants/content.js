// src/constants/content.js

// ===================== EN CONTENT =====================

export const COVER_CONTENT = {
	title: "Learning Quest on Indigenous Cultures",
	paragraphs: [
		"Embark on a journey of discovery and learning through a series of 10 engaging activities designed to build your knowledge of Indigenous realities, expanding your cultural competency and capacity. Each activity will challenge you to explore, reflect, and deepen your understanding of Indigenous perspectives, histories, and contributions.",
		"By the end of this quest, you will have gained valuable insights and skills that will enhance your ability to support reconciliation efforts and foster a more inclusive workplace.",
	],
};

export const INTRO_INFO_CONTENT = {
	title: "Introduction",
	paragraphs: [
		"The Learning Quest was created to spark joy and curiosity in public servants while supporting their journey toward meaningful allyship. Developed by Indigenous-identifying creators, it encourages learning through shared experiences, helping participants connect through common interests and resource sharing.",
		"Rather than being a test of knowledge, the Learning Quest is a lifelong practice—an invitation to explore Indigenous perspectives in everyday life with openness and intention.",
		"The Learning Quest on Indigenous Cultures is a flexible team activity designed to help you learn more about Indigenous histories, cultures, and perspectives. Through 10 engaging activities, you’ll explore, reflect, and take action to build your cultural awareness and support reconciliation.",
		"You can complete the quest individually or with a team. Working together allows for deeper conversations and shared learning. Each activity encourages you to think critically, ask questions, and connect what you learn to your personal and professional lives.",
		"The quest is customizable and can be done at your own pace over several weeks. Regular team check-ins help you share insights, discuss challenges, and support each other’s learning journeys.",
	],
	bullets: [
		{
			heading: "How does the Learning Quest work?",
			items: [
				"Gather your team. If your work team can’t participate, form your own team or find a partner to be your study-buddy.",
				"As a team, determine the quest parameters: Will you focus on specific nations and communities, or will you take a regional approach and learn something about Indigenous Peoples from each area of the country? Will you try to learn about all three distinct peoples: First Nations, Inuit and Métis?",
				"Give yourself time to work on the quest: Encourage your colleagues, post updates and share resources in your Teams chat. If there’s a topic that interests you beyond the quest questions, go for it!",
				"Book a team meeting to discuss your experiences: Set protocols for a safe space. What does everyone need to feel respected, heard, and supported? What was your main take-away from the experience?",
				"Wrap it up… and keep questing: Share your resources on Best media by Indigenous voices, continue your learning journey all year long, and be part of the change by getting actively involved in reconciliation. The Reconciliation Path interactive job aid provides practical resources and ideas.",
			],
		},
	],
	details: {
		steps: [
			{
				bullets: [
					"If your work team can’t participate, form your own team or find a study-buddy.",
				],
			},
			{
				bullets: [
					"Will you focus on specific nations/communities, or learn region by region?",
					"Will you explore all three distinct Peoples: First Nations, Inuit, and Métis?",
				],
			},
			{
				bullets: [
					"Encourage colleagues, post updates, and share resources in your Teams chat.",
					"If a topic interests you beyond the quest questions, go for it!",
				],
			},
			{
				bullets: [
					"Set protocols for a safe space—what do people need to feel respected and supported?",
					"What was your main takeaway from the experience?",
				],
			},
			{
				bullets: [
					"Share your resources on “Best media by Indigenous voices”.",
					"Continue learning year-round.",
					"Be part of the change—get actively involved in reconciliation (see the Reconciliation Path job aid).",
				],
			},
		],
	},
	ui: {
		sectionTitle: "Introduction",
		whatTitle: "What is the Learning Quest on Indigenous Cultures?",
		quickSummaryAria: "Quick summary",
		summary: {
			format: { dt: "Format", dd: "10 activities • self-paced" },
			collab: { dt: "Collaboration", dd: "Individual or team" },
			goal: { dt: "Goal", dd: "Awareness & action for reconciliation" },
		},
		steps: {
			gatherTeam: "Gather your team",
			setParams: "Set your parameters",
			giveTime: "Give yourself time",
			meetReflect: "Meet & reflect",
			wrapKeep: "Wrap up & keep questing",
		},
		tip: {
			label: "Tip",
			text: {
				pre: "Use a",
				highlight: "safe, respectful space",
				post: "for team check-ins and keep learning by sharing resources together.",
			},
		},
	},
};

export const PREPARATION_CONTENT = {
	title: "Preparation",
	paragraphs: [
		"Complete the tasks and activities that follow and use the notes space to keep track of your learning journey. You can also customize the activities based on your team’s quest parameters. Identify in advance how much time to give each activity.",
		"Don’t feel pressured to complete all the activities in a set period. You should only complete the ones you feel comfortable completing. But be prepared to be challenged as you learn, grow, and build your cultural capacity.",
		"Need a starting point? Consult Best media by Indigenous voices.",
	],
	ui: {
		sectionTitle: "Preparation",
		howTitle: "How does the Learning Quest work?",
		instructions:
			"Click a card to flip it and read the step. A green check will appear after you’ve viewed a card.",
		stepLabel: "Step",
		sr: {
			flip: "Press Enter or Space to flip and read the description.",
			flipBack: "Press Enter, Space, or F to flip back.",
		},
	},
};

// src/constants/teamContent.js (or wherever you keep content)
export const TEAM_CONTENT = {
	title: "Team Reflection",
	// Use instructionsHtml if you want markup. Keep plain text in instructionText otherwise.
	instructionPill: "Instruction",
	instructionsHtml:
		"<p>To make the most of your team discussions during the learning quest, follow these steps to create a safe, respectful, and reflective learning environment.</p>",
	stepsHeading: "Steps",
	savedLabel: "Saved",
	clickToMark: "Click to mark",
	stepsCompleteMessage: "Great—steps complete!",
	quickPrompts: [
		"One thing that surprised me…",
		"A perspective I hadn’t considered…",
		"Where I might follow up…",
		"How this connects to my work…",
	],
	reflectionPrompt:
		"Based on what I’ve learned so far, one thing I want to carry forward in my role is...",
	reflectionPlaceholder: "Write a few sentences…",
	notesSaveTip: "Tip: notes save automatically in this lesson.",
	wordsLabelSingular: "word",
	wordsLabelPlural: "words",
	// Steps: headings + items as plain strings (no bullet glyphs)
	steps: [
		{
			heading: "Set the tone for respectful dialogue",
			items: [
				"Begin each meeting by revisiting group agreements or shared values, such as respect, open-mindedness, and confidentiality.",
				"Invite team members to share how they’re feeling about the learning journey so far.",
			],
		},
		{
			heading: "Share learnings and reflections",
			items: [
				"Ask each team member to share highlights from one or more activities they completed.",
				"Encourage them to discuss what surprised them, challenged their assumptions, or left a lasting impression.",
				"What did you learn that shifted your perspective?",
				"How did this activity connect to your personal or professional life?",
				"What questions do you still have?",
			],
		},
		{
			heading: "Connect learning to the workplace",
			items: [
				"Discuss how insights from the quest relate to your team’s work and the public service more broadly.",
				"How can this knowledge help build better relationships with Indigenous communities?",
				"What changes—big or small—can we make to support reconciliation in our daily work?",
			],
		},
		{
			heading: "Make a commitment",
			items: [
				"Invite each team member to identify one action they will take to continue learning or contribute to reconciliation.",
				"This could include using Indigenous-owned resources, incorporating Indigenous perspectives into work, or continuing personal education.",
			],
		},
		{
			heading: "Keep the conversation going",
			items: [
				"Schedule future check-ins or informal gatherings to continue the conversation.",
				"Encourage participants to post resources, reflections, or questions in your Teams chat.",
			],
		},
	],
};
export const CONCLUSION_CONTENT = {
	lang: "en",
	title: "Conclusion",
	paragraphs: [
		"As your team wraps up the Learning Quest on Indigenous Cultures, take a moment to recognize the learning, reflection, and conversations you’ve shared. Each activity was an opportunity to explore new perspectives, challenge assumptions, and grow together.",
		"This quest was designed to be flexible and personal. Whether you completed every step or focused on a few, what matters most is the awareness and understanding you’ve built along the way.",
		"Your team discussions helped bring the learning to life through open dialogue, shared insights, and thoughtful questions. These conversations are just the beginning.",
		"As you move forward, think about how you can carry this learning into your daily work. What actions will you take? What commitments will you make? Reconciliation is an ongoing journey. Thank you for taking these important steps together and with openness, respect, and intention.",
	],
	// optional override for the feedback button label
	feedbackLabel: "Feedback",
};
// content/resourcesContent.js
export const RESOURCES_CONTENT = {
	lang: "en",
	title: "Resources",
	ui: {
		exportPdf: "Export PDF",
		exportWord: "Export Word",
		filterAll: "All",
		filterFavourites: "Favourites",
		moreLinks: "More links",
		openLink: "Open link",
		favorite: "Favorite",
		unfavorite: "Unfavorite",
		read: "Read",
		addedToFav: "added to favourites.",
		removedFromFav: "removed from favourites.",
		openPrintAria: "Open print dialog to save as PDF",
		exportWordAria: "Download a Word document",
		openLinkAriaPrefix: "Open link:",
		pageTitle: "Resources",
		noResources: "No resources available.",
	},
	sections: [
		{
			title: "Best media by Indigenous voices",
			summary: "A mural collection curated by Parks Canada team members.",
			type: "Media",
			links: [
				{
					label: "Best media by Indigenous voices (mural — Parks Canada team)",
					url: "https://app.mural.co/t/indigenousaffairsbranchdirce6046/m/indigenousaffairsbranchdirce6046/1733400932867/26fd87eadffbefc3c535b15c45c067d7811364f",
				},
			],
			tags: ["Parks Canada"],
		},
		{
			title: "The Reconciliation Path (CSPS)",
			summary: "Interactive job aid from the Canada School of Public Service.",
			type: "Job aid",
			links: [
				{
					label: "The Reconciliation Path (CSPS job aid)",
					url: "https://catalogue.csps-efpc.gc.ca/product?catalog=IRA1-J16&cm_locale=en",
				},
			],
			tags: ["CSPS"],
		},
		{
			title: "Indigenous Awareness, Cultural Safety and Capacity Building",
			summary:
				"GCpedia page compiled by Environment and Climate Change Canada.",
			type: "Government resource",
			links: [
				{
					label:
						"Indigenous Awareness, Cultural Safety and Capacity Building (GCpedia – ECCC)",
					url: "https://www.gcpedia.gc.ca/wiki/Sensibilisation_%C3%A0_la_culture_autochtone_la_s%C3%A9curit%C3%A9_culturelle_et_le_renforcement_des_capacit%C3%A9s_autochtones_%C3%A0_ECCC",
				},
			],
			tags: ["ECCC"],
		},
		{
			title: "Conservation Through Reconciliation Partnership",
			summary:
				"Indigenous-led conservation reading list, Virtual Campfire webinars, and a knowledge basket for Indigenous protected and conserved areas.",
			type: "Conservation",
			links: [
				{
					label: "Indigenous-led conservation reading list (short link)",
					url: "https://bit.ly/IndLedConsRL",
				},
				{
					label:
						"Virtual Campfire (Conservation Through Reconciliation Partnership)",
					url: "https://conservation-reconciliation.ca/virtual-campfire",
				},
				{
					label:
						"IPCA knowledge basket (Indigenous protected and conserved areas)",
					url: "https://ipacknowledgebasket.ca/",
				},
			],
			tags: ["Conservation"],
		},
		{
			title: "Striking Balance: Tsá Tué Biosphere Reserve",
			summary: "Documentary on Indigenous conservation (TVO).",
			type: "Documentary",
			links: [
				{
					label: "Striking Balance: Tsá Tué Biosphere Reserve (TVO film)",
					url: "https://www.tvo.org/video/documentaries/tsa-tue-biosphere-reserve",
				},
			],
			tags: ["TVO"],
		},
		{
			title: "Fundamentals of OCAP® (FNIGC)",
			summary:
				"Training on OCAP® (ownership, control, access and possession) from the First Nations Information Governance Centre.",
			type: "Training",
			links: [
				{
					label: "Fundamentals of OCAP® (FNIGC course)",
					url: "https://fnigc.ca/fr/les-principes-de-pcap-des-premieres-nations/suivre-le-cours/",
				},
			],
			tags: ["FNIGC"],
		},
		{
			title: "Inuit societal values (Government of Nunavut)",
			summary:
				"Reference on Inuit societal values from the Government of Nunavut.",
			type: "Values",
			links: [
				{
					label: "Inuit societal values (Government of Nunavut)",
					url: "https://www.gov.nu.ca/fr/culture-langue-patrimoine-et-art/valeurs-societales-inuites",
				},
			],
			tags: ["Nunavut"],
		},
		{
			title: "Métis governance practices (open access)",
			summary:
				"BCcampus / OpenTextBC chapter on Métis governance — part of Indigenous Digital Literacies (open access).",
			type: "Governance",
			links: [
				{
					label: "Métis governance practices (OpentextBC / BCcampus)",
					url: "https://opentextbc.ca/indigenousdigitalliteracies/chapter/metis-governance/",
				},
			],
			tags: ["BCcampus"],
		},
		{
			title: "Public education (First Peoples Law)",
			summary:
				"Resources on legal topics such as rights, treaties and land claims (public education).",
			type: "Law",
			links: [
				{
					label: "Public education (First Peoples Law)",
					url: "https://www.firstpeopleslaw.com/public-education",
				},
			],
			tags: ["Law"],
		},
		{
			title: "4 Seasons of Indigenous Learning",
			summary:
				"4 Seasons training offered by Outdoor Learning School & Store (program + learning resources).",
			type: "Training",
			links: [
				{
					label:
						"4 Seasons of Indigenous Learning (Outdoor Learning School & Store)",
					url: "https://outdoorlearning.com/4-seasons/",
				},
			],
			tags: ["Outdoor Learning"],
		},
	],
};

// Animation timings used across the TOC
export const TOC_ANIM = {
	baseDuration: 3.6,
	baseDelay: 0.0,
	progDuration: 2.6,
	progDelay: 0.45,
	nodeDelay0: 0.22,
	nodeStagger: 0.11,
	cardDelay0: 0.5,
	cardStagger: 0.09,
};

// Default card offsets per section (index-aligned to items list below)
export const DEFAULT_CARD_OFFSETS = [
	{ x: 40, y: -180 }, // Intro
	{ x: 40, y: -10 }, // Preparation
	{ x: 65, y: -185 }, // Activities
	{ x: 100, y: 10 }, // Team
	{ x: -65, y: 0 }, // Reflection (if present)
	{ x: 10, y: -170 }, // Conclusion
	{ x: -70, y: -200 }, // Resources
];

// Node & card layout constants
export const NODE_RADIUS = 26;
export const CARD_GAP_Y = 40;
export const SVG_VIEWBOX = "0 0 1200 230";
export const SVG_PATH_D =
	"M0,165 C220,65 420,205 600,125 C780,45 980,205 1200,125";

// ===================== FR CONTENT =====================

export const COVER_CONTENT_FR = {
	title: "Quête d’apprentissage sur les cultures autochtones",
	paragraphs: [
		"Venez entreprendre un parcours de découverte et d’apprentissage composé de dix activités stimulantes conçues pour renforcer votre connaissance des réalités autochtones et ainsi accroître vos compétences culturelles. Chaque activité vous invitera à l’exploration, à la réflexion et à l’approfondissement de votre compréhension des perspectives, histoires et contributions des peuples autochtones.",
		"Au terme de cette quête, vous aurez acquis des connaissances et des compétences précieuses pour mieux soutenir les efforts de réconciliation et favoriser un milieu de travail inclusif.",
	],
};

export const INTRO_INFO_CONTENT_FR = {
	title: "Introduction",
	paragraphs: [
		"La quête d’apprentissage a été créée pour susciter joie et curiosité chez les fonctionnaires, tout en les aidant à devenir des personnes alliées fidèles à la cause et aux réalités des peuples autochtones. Conçue par des Autochtones, elle stimule l’apprentissage par des mises en commun qui permettent aux participantes et participants de nouer des liens autour d’intérêts communs et du partage de ressources. Il ne s’agit pas d’un test de connaissance, mais plutôt d’une pratique à long terme – une invitation à découvrir les perspectives autochtones au quotidien, en faisant preuve d’ouverture et de volonté.",
		"La quête d’apprentissage sur les cultures autochtones est une activité d’équipe souple conçue pour vous aider à en apprendre plus sur les histoires, cultures et perspectives autochtones. Dix activités stimulantes vous inviteront à l’exploration, à la réflexion et à l’action pour que vous puissiez renforcer vos connaissances culturelles et soutenir les efforts de réconciliation.",
		"Vous pouvez mener la quête en solo ou en équipe, sachant que la collaboration favorise les discussions poussées et permet de mettre en commun les apprentissages. Chaque activité vous invitera à penser de façon critique, à poser des questions et à faire des liens entre vos apprentissages et votre vie personnelle et professionnelle.",
		"La quête est personnalisable, et vous pouvez la mener à votre rythme sur plusieurs semaines. Des rencontres de suivi régulières permettront aux membres de l’équipe de présenter leurs perspectives, de discuter des enjeux et de s’entraider.",
	],
	bullets: [
		{
			heading: "Fonctionnement",
			items: [
				`
      <div class="bullet-item">
        <p class="bullet-body">
          Si votre équipe de travail ne peut pas participer à la quête d’apprentissage,
          formez votre propre équipe ou trouvez-vous un(e) partenaire d’étude.
        </p>
      </div>
      `,
				`
      <div class="bullet-item">
        <p class="bullet-body">
          Quelques pistes pour vous orienter : allez-vous vous concentrer sur des nations et
          communautés particulières, ou adopter une approche régionale pour découvrir les
          peuples autochtones de chaque région du pays ? Allez-vous étudier les Premières
          Nations, les peuples inuits et les Métis ?
        </p>
      </div>
      `,
				`
      <div class="bullet-item">
        <p class="bullet-body">
          Encouragez vos collègues, publiez des mises à jour et partagez des ressources dans Teams.
          Si des sujets secondaires piquent votre curiosité, prenez le temps de les explorer.
        </p>
      </div>
      `,
				`
      <div class="bullet-item">
        <p class="bullet-body">
          Établissez des protocoles pour un espace sécuritaire : de quoi les participant·e·s
          ont-ils besoin pour se sentir respectés, écoutés et soutenus ? Que retenez-vous de
          l’expérience ?
        </p>
      </div>
      `,
				`
      <div class="bullet-item">
        <p class="bullet-body">
          Publiez vos ressources en ligne sur la murale
          « <a href="https://app.mural.co/t/indigenousaffairsbranchdirec6046/m/indigenousaffairsbranchdirec6046/1733400932867/26fd87eadfffbefc3c535b15c45c067d7811364f"
                 target="_blank" rel="noopener noreferrer" aria-label="Murale - Les meilleurs médias par les voix autochtones">
                 Les meilleurs médias par les voix autochtones
              </a> », créée par des membres de l’équipe de Parcs Canada.
          Poursuivez votre parcours d’apprentissage toute l’année et participez activement
          aux efforts de réconciliation.
        </p>
      </div>
      `,
			],
		},
	],
	details: {
		steps: [
			{
				bullets: [
					"Étapes et activités de la quête",
					"Préparation",
					"Réunion d’équipe : étapes et questions potentielles",
					"Question de réflexion facultative",
					"Conclusion",
					"Ressources",
				],
			},
		],
	},
	ui: {
		sectionTitle: "Introduction",
		whatTitle:
			"Qu’est-ce que la quête d’apprentissage sur les cultures autochtones?",
		quickSummaryAria: "Résumé rapide",
		summary: {
			format: { dt: "Format", dd: "10 activités • à votre rythme" },
			collab: { dt: "Collaboration", dd: "Individuel ou en équipe" },
			goal: {
				dt: "Objectif",
				dd: "Sensibilisation et action pour la réconciliation",
			},
		},
		steps: {
			gatherTeam: "Rassemblez votre équipe",
			setParams: "Déterminez les paramètres",
			giveTime: "Donnez-vous du temps",
			meetReflect: "Préparez une rencontre d’équipe",
			wrapKeep: "Résumez et poursuivez",
		},
		tip: {
			label: "Conseil",
			text: {
				pre: "Utilisez un",
				highlight: "espace sécuritaire et respectueux",
				post: "pour vos rencontres d’équipe et poursuivez l’apprentissage en partageant des ressources.",
			},
		},
	},
};

export const PREPARATION_CONTENT_FR = {
	title: "Préparation",
	paragraphs: [
		"Accomplissez les tâches et les activités ci-dessous, et notez l’avancement de votre parcours d’apprentissage dans les zones prévues à cette fin. Vous pouvez également personnaliser les activités en fonction des paramètres de la quête établis précédemment. Prédéterminez la durée de chaque activité.",
		"Il n’est toutefois pas obligatoire de mener toutes les activités dans un délai précis. Vous n’avez pas non plus à accomplir les activités qui vous mettent mal à l’aise. Mais préparez-vous à relever des défis au fur et à mesure de vos apprentissages, de votre croissance et du renforcement de vos compétences culturelles.",
		"Vous ne savez pas par où commencer? Consultez Les meilleurs médias par les voix autochtones.",
	],
	ui: {
		sectionTitle: "Préparation",
		howTitle: "Fonctionnement",
		instructions:
			"Cliquez sur une carte pour l’inverser et lire l’étape. Une coche verte apparaîtra après avoir consulté une carte.",
		stepLabel: "Étape",
		sr: {
			flip: "Appuyez sur Entrée ou Espace pour inverser la carte et lire la description.",
			flipBack: "Appuyez sur Entrée, Espace ou F pour revenir.",
		},
	},
};
export const TEAM_CONTENT_FR = {
	title: "Réunion d’équipe : étapes et questions potentielles",
	instructionPill: "Instruction",
	// kept as HTML per your request (paragraphs, formatting)
	instructionsHtml: `<p>Suivez les étapes ci-dessous pour créer un environnement d’apprentissage sécuritaire, respectueux et propice à la réflexion afin de tirer le maximum de vos discussions d’équipe durant votre quête.</p>`,
	stepsHeading: "Étapes",
	savedLabel: "Enregistré",
	clickToMark: "Cliquez pour marquer",
	stepsCompleteMessage: "Super — toutes les étapes sont complétées !",
	quickPrompts: [
		"Une chose qui m’a surpris…",
		"Une perspective que je n’avais pas considérée…",
		"Où je pourrais faire un suivi…",
		"Comment cela se relie à mon travail…",
	],
	reflectionPrompt:
		"« Compte tenu de ce que j’ai appris jusqu’à présent, une chose que je souhaite mettre en pratique au travail, c’est… »",
	reflectionPlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
	notesSaveTip:
		"Astuce : les notes s’enregistrent automatiquement dans cette leçon.",
	wordsLabelSingular: "mot",
	wordsLabelPlural: "mots",
	steps: [
		{
			heading: "Donner le ton pour un dialogue respectueux",
			items: [
				"Commencez chaque rencontre en passant en revue les ententes ou les valeurs de l’équipe, comme le respect, l’ouverture d’esprit et la confidentialité.",
				"Invitez les membres de l’équipe à faire part de leurs impressions jusqu’ici.",
			],
		},
		{
			heading: "Échanger sur vos apprentissages et réflexions",
			items: [
				"Demandez à chaque membre de l’équipe de présenter les faits saillants d’au moins une activité qu’il ou elle a accomplie.",
				"Encouragez chaque personne à parler de ce qui l’a surprise, de ce qui a remis en question ses façons de voir les choses ou de ce qui l’a particulièrement marquée.",
				"Quel apprentissage a modifié votre perspective?",
				"De quelle manière l’activité était-elle liée à votre vie personnelle ou professionnelle?",
				"Quelles questions vous posez-vous encore?",
			],
		},
		{
			heading:
				"Établir des liens entre vos apprentissages et votre milieu de travail",
			items: [
				"Discutez de la manière dont les apprentissages faits durant la quête se rapportent au travail de votre équipe et à la fonction publique dans son ensemble.",
				"Comment ce savoir peut-il renforcer les relations avec les communautés autochtones?",
				"Quels changements — grands ou petits — peut-on apporter pour soutenir les efforts de réconciliation au quotidien?",
			],
		},
		{
			heading: "Prendre un engagement",
			items: [
				"Invitez chaque membre de l’équipe à cibler une mesure à prendre pour poursuivre ses apprentissages ou contribuer aux efforts de réconciliation.",
				"Il pourrait notamment s’agir d’utiliser des ressources autochtones, de tenir compte des perspectives autochtones pour effectuer un travail, ou de poursuivre sa formation personnelle.",
			],
		},
		{
			heading: "Continuer la conversation",
			items: [
				"Planifiez d’autres rencontres de suivi ou réunions informelles pour continuer la conversation.",
				"Encouragez les membres de l’équipe à publier des ressources, des réflexions ou des questions dans Teams.",
			],
		},
	],
};

export const CONCLUSION_CONTENT_FR = {
	lang: "fr",
	title: "Conclusion",
	paragraphs: [
		"Prenez un moment au terme de votre quête d’apprentissage sur les cultures autochtones pour récapituler en équipe vos apprentissages, vos réflexions et vos discussions. Chaque activité vous a donné l’occasion de découvrir de nouvelles perspectives, de remettre en question vos hypothèses et de grandir ensemble.",
		"Cette quête a été conçue pour s’adapter à vos réalités. Que vous ayez mené toutes les activités ou seulement quelques-unes d’entre elles, le plus important, c’est le savoir que vous avez acquis en chemin.",
		"Par le dialogue ouvert, l’échange de points de vue et les questions réfléchies, les discussions d’équipe ont fait fleurir vos apprentissages. Ce n’est là que le début.",
		"Pensez maintenant aux différentes façons d’intégrer ces apprentissages dans votre travail quotidien. Quelles mesures et quels engagements prendrez-vous? La réconciliation n’a pas de fin. Merci de participer à ces efforts importants avec ouverture, respect et volonté.",
	],
	// optional override:
	feedbackLabel: "Rétroaction",
};

export const RESOURCES_CONTENT_FR = {
	lang: "fr",
	title: "Ressources",
	ui: {
		exportPdf: "Exporter en PDF",
		exportWord: "Exporter Word",
		filterAll: "Tous",
		filterFavourites: "Favoris",
		moreLinks: "Plus de liens",
		openLink: "Ouvrir le lien",
		favorite: "Ajouter aux favoris",
		unfavorite: "Retirer des favoris",
		read: "Visité",
		addedToFav: "ajouté aux favoris.",
		removedFromFav: "retiré des favoris.",
		openPrintAria: "Ouvrir la boîte d'impression pour enregistrer en PDF",
		exportWordAria: "Télécharger un document Word",
		openLinkAriaPrefix: "Ouvrir le lien:",
		pageTitle: "Ressources",
		noResources: "Aucune ressource disponible.",
	},
	sections: [
		{
			title: "Les meilleurs médias par des voix autochtones",
			summary:
				"Murale créée par les membres de l’équipe de Parcs Canada — collection de médias et ressources.",
			type: "Média",
			links: [
				{
					label:
						"Murale — Les meilleurs médias par des voix autochtones (Parcs Canada)",
					url: "https://app.mural.co/t/indigenousaffairsbranchdirec6046/m/indigenousaffairsbranchdirec6046/1733400932867/26fd87eadfffbefc3c535b15c45c067d7811364f",
				},
			],
			tags: ["Parcs Canada"],
		},
		{
			title: "Outil — Le sentier de la réconciliation (ÉFPC)",
			summary:
				"Outil interactif créé par l’École de la fonction publique du Canada (IRA1-J16).",
			type: "Outil",
			links: [
				{
					label:
						"Le sentier de la réconciliation (outil — École de la fonction publique du Canada)",
					url: "https://catalogue.csps-efpc.gc.ca/product?catalog=IRA1-J16&cm_locale=fr",
				},
			],
			tags: ["ÉFPC"],
		},
		{
			title: "Sensibilisation aux cultures autochtones (GCpedia — ECCC)",
			summary:
				"Page GCpedia : sensibilisation à la culture autochtone, sécurité culturelle et renforcement des capacités (ECCC).",
			type: "Ressource gouvernementale",
			links: [
				{
					label: "Sensibilisation aux cultures autochtones (GCpedia — ECCC)",
					url: "https://www.gcpedia.gc.ca/wiki/Sensibilisation_%C3%A0_la_culture_autochtone,_la_s%C3%A9curit%C3%A9_culturelle_et_le_renforcement_des_capacit%C3%A9s_autochtones_%C3%A0_ECCC",
				},
			],
			tags: ["ECCC"],
		},
		{
			title: "Conservation Through Reconciliation Partnership",
			summary:
				"Ressources : liste de lecture sur la conservation autochtone, webinaires Virtual Campfire et Panier de savoir sur les aires protégées autochtones.",
			type: "Conservation",
			links: [
				{
					label: "Liste de lecture sur la conservation (lien court)",
					url: "https://bit.ly/IndLedConsRL",
					enOnly: true,
				},
				{
					label:
						"Virtual Campfire (Conservation Through Reconciliation Partnership)",
					url: "https://conservation-reconciliation.ca/virtual-campfire",
					enOnly: true,
				},
				{
					label:
						"Panier de savoir (aires protégées et conservation autochtones)",
					url: "https://ipacknowledgebasket.ca/",
					enOnly: true,
				},
			],
			tags: ["Conservation"],
		},
		{
			title: "Striking Balance : réserve de biosphère Tsá Tué",
			summary: "Documentaire sur la conservation autochtone (TVO).",
			type: "Documentaire",
			links: [
				{
					label: "Striking Balance : réserve de biosphère Tsá Tué (TVO)",
					url: "https://www.tvo.org/video/documentaries/tsa-tue-biosphere-reserve",
					enOnly: true,
				},
			],
			tags: ["TVO"],
		},
		{
			title: "Fondamentaux des principes de PCAP (FNIGC)",
			summary:
				"Formation sur les principes de PCAP (propriété, contrôle, accès et possession) — FNIGC.",
			type: "Formation",
			links: [
				{
					label: "Fondamentaux des principes de PCAP (formation FNIGC)",
					url: "https://fnigc.ca/fr/les-principes-de-pcap-des-premieres-nations/suivre-le-cours/",
				},
			],
			tags: ["FNIGC"],
		},
		{
			title: "Valeurs sociétales inuites (Gouvernement du Nunavut)",
			summary:
				"Ressource du gouvernement du Nunavut sur les valeurs sociétales inuites.",
			type: "Ressource",
			links: [
				{
					label: "Valeurs sociétales inuites (Gouvernement du Nunavut)",
					url: "https://www.gov.nu.ca/fr/culture-langue-patrimoine-et-art/valeurs-societales-inuites",
				},
			],
			tags: ["Nunavut"],
		},
		{
			title: "Pratiques de gouvernance métisses (BCcampus)",
			summary:
				"Ressource Open Access de BCcampus — chapitre sur les pratiques de gouvernance métisses.",
			type: "Gouvernance",
			links: [
				{
					label: "Pratiques de gouvernance métisses (BCcampus / OpenTextBC)",
					url: "https://opentextbc.ca/indigenousdigitalliteracies/chapter/metis-governance/",
					enOnly: true,
				},
			],
			tags: ["BCcampus"],
		},
		{
			title: "Éducation du public (First Peoples Law)",
			summary:
				"Ressources juridiques et pédagogiques sur les droits, traités et revendications territoriales.",
			type: "Loi",
			links: [
				{
					label: "Éducation du public (First Peoples Law)",
					url: "https://www.firstpeopleslaw.com/public-education",
					enOnly: true,
				},
			],
			tags: ["First Peoples Law"],
		},
		{
			title: "Apprentissage autochtone en 4 saisons",
			summary:
				"Formation 4 Seasons offerte par l’Outdoor Learning School & Store.",
			type: "Formation",
			links: [
				{
					label:
						"Apprentissage autochtone en 4 saisons (Outdoor Learning School & Store)",
					url: "https://outdoorlearning.com/4-seasons/",
					enOnly: true,
				},
			],
			tags: ["Outdoor Learning"],
		},
	],
};

export const INTRO_MISC_FR = {
	contact: "autochtones-indigenous@pc.gc.ca",
	note: "Envoyez-nous un court message pour partager votre expérience. Restez curieux, poursuivez l’apprentissage et contribuez à la réconciliation toute l’année.",
};

// UI_STRINGS (global chrome)
export const UI_STRINGS = {
	en: {
		header: { home: "Home" },
		footer: { back: "Back", next: "Next", finish: "Finish" },
		cover: {
			welcomeKicker: "Welcome {name}!",
			welcomeFallbackName: "Learner",
			cta: "Get Started",
		},
		toc: {
			__lang: "en",
			title: "Home",
			sectionsAriaLabel: "Sections",
			ariaCourseProgress: "Course progress",
			srHelp:
				"Use Tab to move between items. Arrow keys also move between icons. Press Enter or Space to open a section.",
			moveHint: "Use arrow keys to move • Enter to open",
			intro: "Introduction",
			preparation: "Preparation",
			activities: "Activities",
			teamReflection: "Team Reflection",
			reflection: "Reflection",
			conclusion: "Conclusion",
			resources: "Resources",
			completed: "Completed",
			visited: "Visited",
			visitedChip: "Visited",
			nodeVisitedSuffix: " (visited)",
			ariaAllActivitiesCompleted: "All activities completed",
			ariaAllActivitiesVisited: "All activities visited",
		},
	},
	fr: {
		header: { home: "Accueil" },
		footer: { back: "Retour", next: "Suivant", finish: "Terminer" },
		cover: {
			welcomeKicker: "Bienvenue {name}!",
			welcomeFallbackName: "Participant",
			cta: "Commencer",
		},
		toc: {
			__lang: "fr",
			title: "Accueil",
			sectionsAriaLabel: "Sections",
			ariaCourseProgress: "Progression du cours",
			srHelp:
				"Utilisez Tab pour vous déplacer entre les éléments. Les flèches déplacent aussi entre les icônes. Appuyez sur Entrée ou Espace pour ouvrir une section.",
			moveHint: "Flèches pour naviguer • Entrée pour ouvrir",
			intro: "Introduction",
			preparation: "Préparation",
			activities: "Activités",
			teamReflection: "Réunion d’équipe",
			reflection: "Question de réflexion facultative",
			conclusion: "Conclusion",
			resources: "Ressources",
			completed: "Terminé",
			visited: "Visité",
			visitedChip: "Visité",
			nodeVisitedSuffix: " (visité)",
			ariaAllActivitiesCompleted: "Toutes les activités sont terminées",
			ariaAllActivitiesVisited: "Toutes les activités ont été visitées",
		},
	},
};

// ===================== ACTIVITIES (EN/FR) =====================
// Keys match your quest ids: "a1"..."a10"
// Tip is the instruction block; links are optional. If FR is missing, app will fall back to EN.

// src/content/activitiesContent.js
export const ACTIVITIES_CONTENT = {
	a1: {
		en: {
			id: "a1",
			number: 1,
			title: "Explore an Indigenous Artist",
			tip: "Explore works by an Indigenous artist that speak to you. Describe how you relate to this artist. How does this artist inspire you?",
			notePlaceholder: "Your reflections on the artist…",
			resourcesHeading: "Resources",
			links: [
				{
					label: "Selection of Indigenous artists in Canada",
					url: "https://www.thecanadianencyclopedia.ca/en/article/important-indigenous-artists",
					icon: "image",
				},
				{
					label: "Selection of Indigenous musicians in Canada",
					url: "https://www.thecanadianencyclopedia.ca/en/article/influential-indigenous-musicians",
					icon: "music",
				},
			],
		},
		fr: {
			id: "a1",
			number: 1,
			title: "Découvrez un artiste autochtone",
			tip: "Découvrez les œuvres d’une ou un artiste autochtone qui vous parle. Décrivez la manière dont vous vous identifiez à cette personne. Comment vous inspire-t-elle?",
			cdata: {
				instructionsHtml: `
        <p>Décrivez la manière dont vous vous identifiez à cette personne.</p>
        <p><strong>Comment vous inspire-t-elle&nbsp;?</strong></p>
      `,
			},
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "Sélection d’artistes autochtones au Canada",
					url: "https://thecanadianencyclopedia.ca/fr/article/artistes-autochtones-importants",
					icon: "image",
				},
				{
					label: "Sélection de musiciens autochtones au Canada",
					url: "https://thecanadianencyclopedia.ca/fr/article/musiciens-autochtones-d-influence-au-canada",
					icon: "music",
				},
			],
		},
	},

	a2: {
		en: {
			id: "a2",
			number: 2,
			title: "Indigenous Medicinal Plants",
			tip: "Discover Indigenous medicinal uses for plants in your area. Describe what you learned.",
			cdata: {
				instructionsHtml: `
          <p>Discover Indigenous medicinal uses for plants in your area.</p>
          <p><strong>Describe what you learned.</strong></p>
        `,
			},
			notePlaceholder: "Plants, uses, teachings you discovered…",
			resourcesHeading: "Resources",
			links: [
				{
					label: "Métis traditional uses for plants (PDF)",
					url: "https://www.metismuseum.ca/media/document.php/148985.La%20Michinn%20revised%20and%20catalogued.pdf",
					icon: "image",
				},
				{
					label:
						"Traditional plant foods of Indigenous Peoples in Canada (book)",
					url: "https://openknowledge.fao.org/server/api/core/bitstreams/02134cf4-156b-47c7-972d-cf2690df1b55/content",
					icon: "image",
				},
			],
		},
		fr: {
			id: "a2",
			number: 2,
			title: "Plantes médicinales autochtones",
			tip: "Découvrez les utilisations médicinales que font les Autochtones des plantes qui poussent dans votre région. Décrivez vos apprentissages.",
			cdata: {
				instructionsHtml: `
          <p>Découvrez les utilisations médicinales que font les Autochtones des plantes qui poussent dans votre région.</p>
          <p><strong>Décrivez vos apprentissages.</strong></p>
        `,
			},
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label:
						"Liste des utilisations traditionnelles des plantes chez les Métis (PDF)",
					url: "https://www.metismuseum.ca/media/document.php/148985.La%20Michinn%20revised%20and%20catalogued.pdf",
					icon: "image",
				},
				{
					label:
						"Livre sur les aliments végétaux traditionnels chez les peuples autochtones du Canada",
					url: "https://openknowledge.fao.org/server/api/core/bitstreams/02134cf4-156b-47c7-972d-cf2690df1b55/content",
					icon: "image",
				},
			],
		},
	},

	a3: {
		en: {
			id: "a3",
			number: 3,
			title: "Make a Traditional Recipe",
			instructionsLabel: "Instructions",
			tip: "Try making a traditional First Nations, Inuit or Métis recipe.\nShare your experience or maybe have a lunch-time potluck.",
			notePlaceholder: "Recipe, process, who you shared it with…",
			resourcesHeading: "Resources",
			groupLabels: {
				firstNations: "First Nations",
				inuit: "Inuit",
				metis: "Métis",
			},
			links: [
				{
					label:
						"Native/Indigenous recipes (First Nations Development Institute)",
					url: "https://www.firstnations.org/knowledge-center/recipes/",
				},
			],
			namePlaceholder: "Recipe name",
			ingredientPlaceholder: "Ingredient (e.g., wild rice)",
			stepPlaceholder:
				"Add a step and press Enter (e.g., Rinse wild rice until water runs clear)",
			addBtn: "Add",
			saveRecipeBtn: "Save recipe",
			downloadAllBtn: "Download all (.docx)",
			savedRecipesHeading: "Saved recipes",
			nothingHere: "Nothing here yet. Save a recipe above.",
			openLinkLabel: "Open link",
			directionsLabel: "Directions",
			editBtn: "Edit",
			deleteBtn: "Delete",
			cancelBtn: "Cancel",
			saveBtn: "Save",
			savedFlash: "Saved",
			recipeCountSuffix: "ingredient",
			downloadOneBtn: "Download",

			// localization for quantity & unit
			qtyPlaceholder: "qty",
			unitPlaceholder: "unit",
			unitOptions: [
				"tsp",
				"tbsp",
				"ml",
				"L",
				"cup",
				"cups",
				"g",
				"kg",
				"oz",
				"lb",
				"pinch",
				"clove",
				"slice",
			],
		},

		fr: {
			id: "a3",
			number: 3,
			title: "Essayez une recette traditionnelle",
			instructionsLabel: "Instructions",
			tip: "Essayez une recette traditionnelle des Premières Nations, Inuit ou Métis.\nFaites part de votre expérience ou organisez un repas-partage.",
			notePlaceholder: "Recette, procédé, avec qui vous l'avez partagée…",
			resourcesHeading: "Ressources",
			groupLabels: {
				firstNations: "Premières Nations",
				inuit: "Inuit",
				metis: "Métis",
			},
			links: [
				{
					label: "Recettes autochtones",
					url: "https://www.firstnations.org/knowledge-center/recipes/",
					enOnly: true,
				},
			],
			namePlaceholder: "Nom de la recette",
			ingredientPlaceholder: "Ingrédient (ex.: riz sauvage)",
			stepPlaceholder:
				"Ajoutez une étape et appuyez sur Entrée (ex.: Rincer le riz sauvage jusqu'à ce que l'eau soit claire)",
			addBtn: "Ajouter",
			saveRecipeBtn: "Enregistrer la recette",
			downloadAllBtn: "Télécharger  (.docx)",
			savedRecipesHeading: "Recettes enregistrées",
			nothingHere: "Rien pour l'instant. Enregistrez une recette ci-dessus.",
			openLinkLabel: "Ouvrir le lien",
			directionsLabel: "Préparation",
			editBtn: "Modifier",
			deleteBtn: "Supprimer",
			cancelBtn: "Annuler",
			saveBtn: "Enregistrer",
			savedFlash: "Enregistré",
			recipeCountSuffix: "ingrédient",
			downloadOneBtn: "Télécharger",
			activityLabel: "Activité", // header & exported title
			ingredientsHeading: "Ingrédients", // used in exports and UI label
			directionsLabel: "Préparation", // used in UI and exports
			qtyPlaceholder: "qté", // French placeholder for quantity
			unitPlaceholder: "unité", // French placeholder for unit
			unitOptions: [
				"tsp",
				"tbsp",
				"ml",
				"L",
				"cup",
				"g",
				"kg",
				"oz",
				"lb",
				"pinch",
			], // localized units

			// french quantity & unit localization
			qtyPlaceholder: "qté",
			unitPlaceholder: "unité",
			unitOptions: [
				"c. à thé", // teaspoon
				"c. à soupe", // tablespoon
				"ml",
				"L",
				"tasse",
				"tasses",
				"g",
				"kg",
				"oz",
				"lb",
				"pincée",
				"gousse",
				"tranche",
			],
		},
	},
	a4: {
		en: {
			id: "a4",
			number: 4,
			title: "Indigenous Peoples Outside Canada",
			tip: "Discover facts about an Indigenous population outside Canada. What stood out to you?",
			notePlaceholder: "Which community? What you learned…",
			resourcesHeading: "Resources",
			links: [
				{
					label: "Global map of Indigenous Peoples (PDF)",
					url: "https://newshour-classroom-tc.digi-producers.pbs.org/uploads/app/uploads/2014/11/A-global-map-of-indigenous-peoples.pdf",
					icon: "map",
				},
			],
		},
		fr: {
			id: "a4",
			number: 4,
			// shorter visible title — fragment of the approved sentence
			title: "Apprenez des faits  sur un peuple autochtone d’ailleurs",
			// keep the approved full sentence for instructions/tip (linguistics happy)
			tip: "Apprenez des faits intéressants sur un peuple autochtone d’ailleurs dans le monde.\nDécrivez vos apprentissages.",
			cdata: {
				instructionsHtml: `
        <p>Apprenez des faits intéressants sur un peuple autochtone d’ailleurs dans le monde.</p>
     <strong>   <p>Décrivez vos apprentissages.</p></strong>

      `,
			},
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "Carte mondiale des peuples autochtone (PDF) ",
					url: "https://newshour-classroom-tc.digi-producers.pbs.org/uploads/app/uploads/2014/11/A-global-map-of-indigenous-peoples.pdf",
					icon: "map",
				},
			],
		},
	},
	// ... inside ACTIVITIES_CONTENT
	// src/constants/content.js (ACTIVITIES_CONTENT.a5)
	a5: {
		en: {
			id: "a5",
			number: 5,
			title: "Film, TV, or Podcast",
			tip: "Watch an Indigenous film or TV show, or listen to an Indigenous-focused podcast. What did you learn?",
			notePlaceholder: "Title, creator(s), insights…",
			resourcesHeading: "Resources",
			links: [
				{
					label: "National Film Board — Indigenous cinema",
					url: "https://www.nfb.ca/indigenous-cinema/?&film_lang=en&sort=year:desc,title&year_min=1939&year_max=2022",
					icon: "film",
					enOnly: false,
				},
				{
					label: "CBC Gem — Indigenous stories",
					url: "https://gem.cbc.ca/section/indigenous-stories",
					icon: "video",
					enOnly: false,
				},
			],
		},

		fr: {
			id: "a5",
			number: 5,
			// French page title (short, localized)
			title: "Film, télévision ou balado",
			// instructions / tip (keeps same intent & length; question will be bolded via cdata)
			tip: "Écoutez un film ou une série télévisée autochtone, ou bien un balado axé sur les Autochtones. Qu’avez-vous appris?",
			cdata: {
				instructionsHtml: `
        <p>Écoutez un film ou une série télévisée autochtone, ou bien un balado axé sur les Autochtones.</p>
        <p><strong>Qu’avez-vous appris?</strong></p>
      `,
			},
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "Cinéma autochtone — Office national du film",
					url: "https://www.onf.ca/cinema-autochtone/?language=fr&sort=year%3Adesc%2Ctitle&year_min=1968&year_max=2025",
					icon: "film",
					enOnly: false,
				},
				{
					label: "Histoires autochtones de CBC Gem",
					url: "https://gem.cbc.ca/section/indigenous-stories",
					icon: "video",
					enOnly: true,
				},
			],
		},
	},

	// ...

	// src/constants/content.js (replace or add the a6 block)
	a6: {
		en: {
			id: "a6",
			number: 6,
			title: "Read a Book",
			tip: "Read a book by a First Nations, Inuit, or Métis author. What did you think?",
			notePlaceholder: "Author, title, key takeaways…",
			resourcesHeading: "Resources",
			links: [
				{
					label: "#IndigenousReads (Government of Canada)",
					url: "https://www.rcaanc-cirnac.gc.ca/eng/1496255894592/1557840487211",
					icon: "book",
					enOnly: false,
				},
				{
					label: "Ask your local library for suggestions",
					url: "https://www.google.com/search?q=Local+public+library",
					icon: "library",
					enOnly: false,
				},
			],
		},

		fr: {
			id: "a6",
			number: 6,
			// shorter visible title — localized
			title: "Lisez un livre",
			// full approved instruction sentence(s) in French
			tip: "Lisez un livre d’un auteur ou autrice des Premières Nations, Inuit ou Métis. Faites part de vos impressions.",
			cdata: {
				instructionsHtml: `
        <p>Lisez un livre d’un auteur ou autrice des Premières Nations, Inuit ou Métis.</p>
        <p><strong>Faites part de vos impressions.</strong></p>
      `,
			},
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "#LecturesAutochtones",
					url: "https://www.rcaanc-cirnac.gc.ca/fra/1496255894592/1557840487211",
					icon: "book",
					// this government resource is bilingual in many cases; set enOnly if it's english-only
					enOnly: false,
				},
				{
					label: "Demandez des suggestions à votre bibliothécaire",
					url: "https://www.google.com/search?q=bibliothèque+municipale",
					icon: "library",
					enOnly: false,
				},
			],
		},
	},

	// content.js (excerpt) — ACTIVITIES_CONTENT.a7

	a7: {
		en: {
			id: "a7",
			number: 7,
			title: "Learn Three Words",
			tip: "Learn to say three words in an Indigenous language. Share them with your team and use them often.",
			notePlaceholder: "Words/phrases and where they’re used…",
			resourcesHeading: "Resources",
			// links used for export & the resource cards UI (label + url)
			links: [
				{
					label: "FirstVoices (Indigenous Language Revitalization Platform)",
					url: "https://www.firstvoices.com/",
				},
				{
					label: "Inuktut glossary (Inuktut Tusaalanga)",
					url: "https://tusaalanga.ca/glossary",
				},
				{
					label: "Michif Language Revitalization Circle (resources)",
					url: "https://speakmichif.ca/learn/resources",
				},
				{
					label: "Métis languages resources (Louis Riel Institute)",
					url: "https://www.louisrielinstitute.ca/metis-languages-learning-resources",
				},
			],
			// optional richer objects for UI outlet tiles
			outlets: [
				{
					href: "https://www.firstvoices.com/",
					label: "FirstVoices (Indigenous Language Revitalization Platform)",

					desc: "A hub for Indigenous languages and learning resources.",
				},
				{
					href: "https://tusaalanga.ca/glossary",
					title: "Inuktut glossary (Inuktut Tusaalanga)",
					desc: "Glossary and language resources for Inuktut.",
				},
				{
					href: "https://speakmichif.ca/learn/resources",
					title: "Michif Language Revitalization Circle (resources)",
					desc: "Michif language learning materials and links.",
				},
				{
					href: "https://www.louisrielinstitute.ca/metis-languages-learning-resources",
					title: "Métis languages resources (Louis Riel Institute)",
					desc: "Resources to learn Métis languages.",
				},
			],
			// small HTML instructions for the callout (optional; used if present)
			instructionsHtml: null,
			// UI labels and small strings used across the page & export (all editable here)
			ui: {
				instructionsPill: "Instructions",
				editorHeading: "Add your words (Flip Cards)",
				editorTip: "Tip: press Enter in the Back field to add quickly.",
				frontPlaceholder: "Front (word / phrase)",
				backPlaceholder: "Back (meaning / translation)",
				addCardButton: "Add card",
				removeButton: "Remove",
				cardsCountSuffix: "cards",
				noCardsPrimary: "No cards yet — add your first above.",
				noCardsSecondary:
					"Add word cards below (word on the front, meaning on the back). Click a card to flip it and practice anytime.",
				newWordLabel: "New word",
				meaningLabel: "Meaning / Translation",
				openLinkLabel: "Open link",
				downloadButton: "Download (.docx)",
				downloadCardsIntro: "New word → Meaning",
				doc: {
					activityTipHeader: "Activity tip",
					resourcesHeader: "Resources",
					savedResponseHeader: "Saved response",
					bulletPointsHeader: "Bullet points",
					wordCardsHeader: "Word cards",
					wordColumn: "Word",
					meaningColumn: "Meaning",
				},
				celebrateTitle: "Nice! You added 3 words 🎉",
				celebrateBody:
					"Keep going—add more and practice by flipping the cards.",
			},
		},

		fr: {
			id: "a7",
			number: 7,
			title: "Apprenez à prononcer trois mots dans une langue autochtone",
			tip: "Apprenez à prononcer trois mots dans une langue autochtone. Présentez ces mots aux membres de votre équipe et employez-les aussi souvent que possible.",
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "FirstVoices (en anglais)",
					url: "https://wstvoices.com/",
				},
				{
					label: "Glossaire Inuktut (en anglais)",
					url: "https://tusaalanga.ca/glossary",
				},
				{
					label:
						"Michif Language Revitalization Circle (ressources) (en anglais)",
					url: "https://speakmichif.ca/learn/resources",
				},
				{
					label:
						"Ressources pour les langues métisses (Louis Riel Institute) (en anglais)",
					url: "https://www.louisrielinstitute.ca/metis-languages-learning-resources",
				},
			],
			outlets: [
				{
					href: "https://www.firstvoices.com/",
					title: "FirstVoices ",
					desc: "Centre de ressources pour les langues autochtones.",
					enOnly: true, // will trigger the FR-only suffix in the UI
				},
				{
					href: "https://tusaalanga.ca/glossary",
					title: "Glossaire Inuktut",
					desc: "Glossaire et ressources linguistiques Inuktut.",
					enOnly: true, // will trigger the FR-only suffix in the UI
				},
				{
					href: "https://speakmichif.ca/learn/resources",
					title: "Michif Language Revitalization Circle",
					desc: "Matériel d’apprentissage du Michif.",
					enOnly: true, // will trigger the FR-only suffix in the UI
				},
				{
					href: "https://www.louisrielinstitute.ca/metis-languages-learning-resources",
					title: "Ressources langues métisses (Louis Riel Institute)",
					desc: "Ressources pour apprendre les langues métisses.",
					enOnly: true, // will trigger the FR-only suffix in the UI
				},
			],
			instructionsHtml: `
      <p>Apprenez à prononcer trois mots dans une langue autochtone et partagez-les avec votre équipe.</p>
      <p><strong>Conseil :</strong> Présentez ces mots aux membres de votre équipe et employez-les aussi souvent que possible.</p>
    `,
			ui: {
				instructionsPill: "Consignes",
				editorHeading: "Ajoutez vos mots (cartes à retourner)",
				editorTip:
					"Astuce : appuyez sur Entrée dans le champ « Retour » pour ajouter rapidement.",
				frontPlaceholder: "Recto (mot / expression)",
				backPlaceholder: "Verso (sens / traduction)",
				addCardButton: "Ajouter la carte",
				removeButton: "Supprimer",
				cardsCountSuffix: "cartes",
				noCardsPrimary:
					"Aucune carte pour l’instant — ajoutez la première au-dessus.",
				noCardsSecondary:
					"Ajoutez des cartes-mots ci-dessous (mot au recto, sens au verso). Cliquez sur une carte pour la retourner et vous entraîner.",
				newWordLabel: "Nouveau mot",
				meaningLabel: "Sens / Traduction",
				openLinkLabel: "Ouvrir le lien",
				downloadButton: "Télécharger (.docx)",
				downloadCardsIntro: "Nouveau mot → Sens",
				doc: {
					activityTipHeader: "Conseil d’activité",
					resourcesHeader: "Ressources",
					savedResponseHeader: "Réponse enregistrée",
					bulletPointsHeader: "Points clés",
					wordCardsHeader: "Cartes-mots",
					wordColumn: "Mot",
					meaningColumn: "Sens",
				},
				celebrateTitle: "Bravo ! Vous avez ajouté 3 mots 🎉",
				celebrateBody:
					"Continuez — ajoutez-en davantage et entraînez-vous en retournant les cartes.",
			},
		},
	},

	// src/constants/content.js (add or replace a8)
	// src/constants/content.js (add/replace this a8 entry inside ACTIVITIES_CONTENT)
	// content.js (excerpt) — ACTIVITIES_CONTENT.a8

	a8: {
		en: {
			id: "a8",
			number: 8,
			title: "Two-Spirit & Indigiqueer Communities",
			tip: "Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories. Find voices to follow and reflect on what you learn.",
			notePlaceholder: "Voices you followed; what you learned…",
			resourcesHeading: "Resources",
			links: [
				{
					label:
						"Indigenous knowledge & Two-Spirit leadership (Native Governance Center)",
					url: "https://nativegov.org/resources/indigenous-knowledge-and-two-spirit-leadership/",
					icon: "article",
					enOnly: true,
				},
				{
					label: "Two-Spirit Library (W2SA)",
					url: "https://w2sa.ca/two-spirit-library",
					icon: "library",
					enOnly: true,
				},
				{
					label: "Two Spirits, One Voice (Egale)",
					url: "https://egale.ca/awareness/two-spirits-one-voice/",
					icon: "article",
					enOnly: true,
				},
			],
			// advocates/voices — rendered as static chips (no href)
			resources: [
				"Dr. James Makokis — Cree Two-Spirit doctor and speaker",
				"Jaris Swidrovich — Two-Spirit Saulteaux pharmacist and educator",
				"Raven Davis — Two-Spirit Anishinaabe artist and community organizer",
				"TJ Cuthand — Theo Jean Cuthand, Two-Spirit Plains Cree filmmaker",
				"Alexa Keleutak — Inuit 2SLGBTQQIA+ representative (Québec)",
				"Chelsea Vowel (âpihtawikosisân) — Métis writer & public intellectual",
			],
		},

		fr: {
			id: "a8",
			number: 8,
			title: "Communautés bispirituelles et autochtones queers",
			tip: "Enrichissez votre compréhension des communautés bispirituelles, Indigiqueer et autochtones 2ELGBTQQIA+ ainsi que de leurs histoires. Découvrez des personnes à suivre et partagez vos apprentissages.",
			cdata: {
				instructionsHtml: `
        <p>Enrichissez votre compréhension des communautés bispirituelles, Indigiqueer et autochtones 2ELGBTQQIA+ et de leurs histoires.</p>
        <p><strong>Découvrez et suivez des personnes qui défendent ces communautés dans les médias sociaux.</strong></p>
      `,
			},
			notePlaceholder: "Cliquez ou tapez ici pour saisir du texte.",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "Ressource de savoir bispirituel",
					url: "https://nativegov.org/resources/indigenous-knowledge-and-two-spirit-leadership/",
					icon: "article",
					enOnly: true,
				},
				{
					label: "Bibliothèque Two-Spirit (W2SA) — en anglais",
					url: "https://w2sa.ca/two-spirit-library",
					icon: "library",
					enOnly: true,
				},
				{
					label: "Deux esprits, une voix (Egale) — en anglais",
					url: "https://egale.ca/awareness/two-spirits-one-voice/",
					icon: "article",
					enOnly: true,
				},
			],
			resources: [
				"Dr. James Makokis — médecin cri bispirituel et conférencier",
				"Jaris Swidrovich — pharmacien saulteaux et éducateur bispirituel",
				"Raven Davis — artiste anishinaabe et organisateur·trice communautaire (bispirituel·le)",
				"TJ Cuthand — cinéaste cri des plaines (Two-Spirit)",
				"Alexa Keleutak — Inuite, représentante 2SLGBTQQIA+ (Québec)",
				"Chelsea Vowel (âpihtawikosisân) — écrivaine métisse et intellectuelle publique",
			],
		},
	},

	// content.js (excerpt) — ACTIVITIES_CONTENT.a9 with enOnly flags on FR outlets

	a9: {
		en: {
			id: "a9",
			number: 9,
			title: "Indigenous-Focused News Story",
			tip: "Uncover a news story with an Indigenous focus and reflect on its scope. What challenges or biases are visible?",
			notePlaceholder: "Story link, your reflections…",
			resourcesHeading: "Suggested Indigenous-Led Outlets",
			links: [
				{ label: "APTN", url: "https://www.aptntv.ca/" },
				{
					label: "The Turtle Island News",
					url: "https://theturtleislandnews.com/",
				},
				{ label: "Ku'ku'kwes News", url: "https://kukukwes.com/" },
				{ label: "IndigiNews", url: "https://indiginews.com/" },
				{ label: "Ha-Shilth-Sa", url: "https://hashilthsa.com/" },
				{ label: "Windspeaker", url: "https://windspeaker.com/" },
			],
			outlets: [
				{
					href: "https://www.aptntv.ca/",
					title: "APTN",
					desc: "National Indigenous television network with news and feature reporting.",
				},
				{
					href: "https://theturtleislandnews.com/",
					title: "The Turtle Island News",
					desc: "Community-focused reporting across Turtle Island.",
				},
				{
					href: "https://kukukwes.com/",
					title: "Ku'ku'kwes News",
					desc: "Independent Indigenous news from Atlantic Canada.",
				},
				{
					href: "https://indiginews.com/",
					title: "IndigiNews",
					desc: "Local Indigenous voices and investigative features.",
				},
				{
					href: "https://hashilthsa.com/",
					title: "Ha-Shilth-Sa",
					desc: "Newspaper of the Nuu-chah-nulth Tribal Council.",
				},
				{
					href: "https://windspeaker.com/",
					title: "Windspeaker",
					desc: "Coverage of Indigenous news, culture and opinion.",
				},
			],
		},

		fr: {
			id: "a9",
			number: 9,
			title: "Reportage axé sur les réalités autochtones",
			tip: "Découvrez un reportage axé sur les réalités autochtones et réfléchissez à la portée du récit : quelles difficultés apparaissent? Quels biais sont présents?",
			notePlaceholder: "Lien vers l’article, vos réflexions…",
			resourcesHeading: "Ressources autochtones proposées",
			links: [
				{ label: "APTN (en anglais)", url: "https://www.aptntv.ca/" },
				{
					label: "The Turtle Island News (en anglais)",
					url: "https://theturtleislandnews.com/",
				},
				{ label: "Ku'ku'kwes (en anglais)", url: "https://kukukwes.com/" },
				{ label: "IndigiNews (en anglais)", url: "https://indiginews.com/" },
				{ label: "Ha-Shilth-Sa (en anglais)", url: "https://hashilthsa.com/" },
				{ label: "Windspeaker (en anglais)", url: "https://windspeaker.com/" },
			],
			outlets: [
				{
					href: "https://www.aptntv.ca/",
					title: "APTN",
					desc: "Réseau national de télévision autochtone avec couverture d’actualités.",
					enOnly: true,
				},
				{
					href: "https://theturtleislandnews.com/",
					title: "The Turtle Island News",
					desc: "Reportages communautaires couvrant Turtle Island.",
					enOnly: true,
				},
				{
					href: "https://kukukwes.com/",
					title: "Ku'ku'kwes News",
					desc: "Actualités autochtones indépendantes de l’Atlantique canadien.",
					enOnly: true,
				},
				{
					href: "https://indiginews.com/",
					title: "IndigiNews",
					desc: "Voix locales autochtones et reportages d’investigation.",
					enOnly: true,
				},
				{
					href: "https://hashilthsa.com/",
					title: "Ha-Shilth-Sa",
					desc: "Journaux du Nuu-chah-nulth Tribal Council.",
					enOnly: true,
				},
				{
					href: "https://windspeaker.com/",
					title: "Windspeaker",
					desc: "Actualités, analyses et opinions autochtones.",
					enOnly: true,
				},
			],
			instructionsHtml: `
      <p>Découvrez un reportage qui porte sur des sujets autochtones et réfléchissez à sa portée.</p>
      <p><strong>Quels défis la communauté rencontre-t-elle?</strong></p>
    `,
		},
	},

	// add this under ACTIVITIES_CONTENT (or replace existing a10)
	// add/replace under ACTIVITIES_CONTENT
	a10: {
		en: {
			id: "a10",
			number: 10,
			title: "Indigenous-Owned Business",
			tip: "Explore a First Nations, Inuit or Métis-owned business (in person or online). What products or services spoke to you and why?",
			notePlaceholder: "Business, offerings, how you’ll support…",
			resourcesHeading: "Resources",
			// links used for export/download
			links: [
				{ label: "Shop First Nations", url: "https://shopfirstnations.com/" },
				{
					label: "17 Canadian Indigenous-Owned Businesses (2025)",
					url: "https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/",
				},
				{
					label: "Indigenous Business Directory (ISC)",
					url: "https://www.sac-isc.gc.ca/rea-ibd",
				},
			],
			// optional richer objects for the UI cards (href + title + desc)
			outlets: [
				{
					href: "https://shopfirstnations.com/",
					title: "Shop First Nations",
					desc: "Marketplace featuring Indigenous-owned makers and brands.",
				},
				{
					href: "https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/",
					title: "17 Canadian Indigenous-Owned Businesses (2025)",
					desc: "A curated roundup of Indigenous-owned businesses across Canada.",
				},
				{
					href: "https://www.sac-isc.gc.ca/rea-ibd",
					title: "Indigenous Business Directory (ISC)",
					desc: "Government-supported searchable directory of Indigenous businesses.",
				},
			],
		},

		fr: {
			id: "a10",
			number: 10,
			title: "Entreprise appartenant à des Autochtones",
			tip: "Découvrez, en personne ou en ligne, une entreprise appartenant à une personne des Premières Nations, inuite ou métisse. Quels produits ou services vous ont interpellé et pourquoi ?",
			notePlaceholder: "Entreprise, offres, comment vous soutiendrez…",
			resourcesHeading: "Ressources",
			links: [
				{
					label: "Shop First Nations (en anglais)",
					url: "https://shopfirstnations.com/",
					enOnly: true,
				},
				{
					label:
						"17 entreprises canadiennes appartenant à des Autochtones (2025) (en anglais)",
					url: "https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/",
					enOnly: true,
				},
				{
					label: "Répertoire des entreprises autochtones (ISC)",
					url: "https://www.sac-isc.gc.ca/rea-ibd",
				},
			],
			outlets: [
				{
					href: "https://shopfirstnations.com/",
					title: "Shop First Nations",
					desc: "Place de marché regroupant des marques et artisans autochtones.",
					enOnly: true,
				},
				{
					href: "https://www.shoplocalcanada.ca/canadian-indigenous-owned-businesses/",
					title:
						"17 entreprises canadiennes appartenant à des Autochtones (2025)",
					desc: "Sélection d’entreprises autochtones au Canada.",
					enOnly: true,
				},
				{
					href: "https://www.sac-isc.gc.ca/rea-ibd",
					title: "Répertoire des entreprises autochtones (ISC)",
					desc: "Répertoire gouvernemental consultable d’entreprises autochtones.",
				},
			],
			// optional HTML instructions to preserve formatting (displayed if present)
			instructionsHtml: `
      <p>Découvrez une entreprise appartenant à une personne inuite, métisse ou des Premières Nations (en personne ou en ligne).</p>
      <p><strong>Réfléchissez :</strong> quels produits ou services ont retenu votre attention et pourquoi? Comment pourriez-vous soutenir cette entreprise?</p>
    `,
		},
	},
};

export const ACTIVITY_UI = {
	en: {
		label: "Activity",
		instructions: "Instructions",
		openLink: "Open link",
		downloadDoc: "Download (.doc)",
		tipAria: "Activity tip",
		iconTitle: "Activity icon",
	},
	fr: {
		label: "Activité",
		instructions: "Consignes",
		openLink: "Ouvrir le lien",
		downloadDoc: "Télécharger (.doc)",
		tipAria: "Conseil d’activité",
		iconTitle: "Icône d’activité",
	},
};
