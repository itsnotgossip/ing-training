import type { TrainingModule } from "./types";

export const turningConversations: TrainingModule = {
  slug: "turning-conversations-into-lifelines",
  title: "Turning Conversations into Lifelines",
  subtitle: "Recognising domestic abuse and responding with compassion",
  description:
    "Learn to recognise the signs of domestic abuse, understand how clients disclose, and respond with compassion. Designed for salon and beauty professionals.",
  minutes: "20 to 30 minutes",
  surveyQuestions: [
    {
      id: "knowledge",
      label: "How would you rate your knowledge of domestic abuse?",
    },
    {
      id: "spotting",
      label:
        "How confident are you that you would spot the signs of domestic abuse?",
    },
    {
      id: "responding",
      label:
        "How confident would you feel responding if a client opened up to you?",
    },
  ],
  steps: [
    {
      type: "hero",
      navTitle: "Welcome",
      kicker: "Salon Training",
      title: "Turning Conversations into Lifelines",
      subtitle: "Recognising domestic abuse and responding with compassion",
      blocks: [
        {
          kind: "note",
          body: "**About the “Quick exit” button:** clicking it (top right) will immediately take you away from this page to a neutral website. It's there for anyone who needs to close this training quickly and discreetly.",
        },
        {
          kind: "card",
          body: "This training takes around **20 to 30 minutes**. Your progress is saved to your account, so you can leave and pick up where you left off at any time, on any device.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "Before we begin",
      kicker: "Before we begin",
      title: "A Note Before We Start",
      blocks: [
        {
          kind: "card",
          body: "A gentle warning before we begin. This training speaks openly about domestic abuse, including emotional, financial, physical and sexual abuse. For some of us this is not a distant subject. It may be your own story, or that of someone you love.\n\nThat is okay, and you are welcome here. You can **pause at any time** and your place is saved. If it ever becomes too much, you can stop, or use the **Quick exit** button in the top corner to leave this page instantly.",
        },
        {
          kind: "note",
          body: "**If any of this brings things up for you, you don't have to sit with it alone.** The National Domestic Abuse Helpline is free, confidential and open 24/7 on **0808 2000 247**, run by Refuge. You'll find more numbers in the help pages near the end.",
        },
        {
          kind: "note",
          body: "**Who this is for:** this training speaks to women, because that is who domestic abuse reaches most often. It happens to men too, and inside LGBTQ+ relationships, and they deserve exactly the same care. There are numbers for anyone in the help pages near the end.",
        },
      ],
    },
    {
      type: "survey",
      navTitle: "Quick questions",
      phase: "pre",
      kicker: "Before we start",
      title: "A Quick Question for You",
      intro:
        "Before we get started, please rate yourself on the questions below. There are no right or wrong answers. You'll answer the same questions at the end, which helps us measure the impact of this training.",
    },
    {
      type: "content",
      navTitle: "The scale of it",
      kicker: "The scale of the problem",
      title: "This Is Bigger Than You Think",
      blocks: [
        {
          kind: "lead",
          body: "Before we go any further, sit with the size of this for a moment.",
        },
        {
          kind: "stats",
          items: [
            {
              n: "1 in 4",
              d: "women will experience domestic abuse in her lifetime",
            },
            {
              n: "1.4m",
              d: "women experienced domestic abuse in the last year alone",
            },
            {
              n: "2 a week",
              d: "women are killed by a current or former partner",
            },
          ],
          source:
            "Sources: ONS and Women's Aid, England and Wales. Figures are updated periodically.",
        },
        {
          kind: "note",
          align: "center",
          body: "Now think of your appointment book this week. The regulars you know by name. **Statistically, this is already in your salon.** You may simply not know yet which one.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "Why you? Why now?",
      kicker: "Why you? Why now?",
      title: "You Already Do This.",
      blocks: [
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F4AC}",
              body: "People tell you things they don't tell anyone else: their partner, their GP, their family.",
            },
            {
              emoji: "✂️",
              body: "You see your clients regularly, in a relaxed, private space. You notice when something changes.",
            },
            {
              emoji: "\u{1F49C}",
              body: "You already listen without judgement. We're simply here to help you know what to do next.",
            },
          ],
        },
        {
          kind: "note",
          body: "This isn't about replacing professionals. **It's about being a bridge.**",
        },
      ],
    },
    {
      type: "content",
      navTitle: "What is domestic abuse?",
      kicker: "Section 01 · What is domestic abuse?",
      title: "More Than You Might Think",
      blocks: [
        {
          kind: "card",
          variant: "purple",
          body: "Domestic abuse is a **pattern of behaviour** used by someone to control or obtain power over their partner or ex-partner. It is **never the fault** of the person experiencing it, and it is **a crime**.",
        },
        {
          kind: "card",
          align: "center",
          body: "*A common myth is that it's only abuse if it's physical.*\n*In fact, many people experience domestic abuse without ever being physically harmed.*",
        },
      ],
    },
    {
      type: "content",
      navTitle: "The different forms",
      kicker: "Section 01 · What is domestic abuse?",
      title: "The Different Forms",
      blocks: [
        {
          kind: "lead",
          body: "Most people living with abuse experience several of these at once, and none is milder than another. You are not here to work out which one it is. Just to know them when you feel them.",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F9E0}",
              title: "Emotional abuse & gaslighting",
              body: "Constant put-downs, or being made to doubt your own mind.",
              more: "This is the abuse that leaves no bruise, so it is the easiest to miss and the hardest to name. It looks like being criticised until you stop trusting your own judgement, being told you are too sensitive, too much, that you're crazy, that you're remembering it wrong. Over time a woman can end up apologising for things that were never her fault. In the chair it can sound like “I'm probably overreacting” or “he says I'm mad.” When someone doubts her own memory in front of you, that is worth noticing.",
            },
            {
              emoji: "\u{1F512}",
              title: "Coercive control",
              body: "A slow tightening of control over everyday life.",
              more: "Coercive control is the pattern underneath most abuse, and it rarely looks dramatic from the outside. It is the rules that grow one at a time until a woman's whole world has quietly shrunk to what one other person allows. The mileage checked on the car. Needing to know where she is at all times. Friends who fell away without her ever deciding to let them go. It has been a crime in England and Wales since 2015. You might hear it as “he doesn't like me coming here,” or “I'm not really allowed.”",
            },
            {
              emoji: "\u{1F44A}",
              title: "Physical abuse",
              body: "Any physical harm, or the threat of it.",
              more: "This is the form people picture first, but it usually arrives after months or years of the others. Injuries get explained away, hidden under clothes, or placed where they won't show. Notice the explanation that doesn't quite fit the injury, the flinch, the long sleeves in summer. You never need to be certain. Being afraid of someone you love is reason enough to gently leave the door open.",
            },
            {
              emoji: "\u{1F4F1}",
              title: "Tech abuse",
              body: "Being watched, tracked or harassed through phones and devices.",
              more: "Abuse now travels through the phone in her pocket. Messages that must be answered instantly. Location shared “for safety.” Passwords demanded, accounts checked, private photos used as threats. It can make a woman feel there is nowhere the other person cannot reach her. If a phone lights up again and again while she is with you, and you watch her face change, that is tech abuse happening in the room.",
            },
            {
              emoji: "\u{1F4B0}",
              title: "Economic abuse",
              body: "Control over money, work and the things you need to live.",
              more: "Money is one of the quietest cages. It can look like an allowance she has to account for, debts run up in her name, being stopped from working, or having no bank card of her own. Without money of her own, leaving can feel impossible, which is exactly the point of it. You might hear “I'd have to ask him” about something small, or “I'm not allowed my own account.”",
            },
            {
              emoji: "⚠️",
              title: "Sexual abuse",
              body: "Any sexual act without consent, including inside a relationship or marriage.",
              more: "Consent does not stop mattering because two people are together or married. Pressure, coercion and assault happen inside relationships, and they are among the hardest things to say out loud, because of the shame wrapped around them. You will rarely hear this one directly, and you don't need to. The same calm, believing response you would give to anything else is exactly right here too.",
            },
          ],
        },
        {
          kind: "note",
          align: "center",
          body: "You don't have to memorise these. You just have to be the kind of person someone feels safe telling. That is the whole job.",
        },
      ],
    },
    {
      type: "quiz",
      navTitle: "Knowledge check",
      kicker: "Knowledge check · Section 01",
      title: "Quick Check",
      questions: [
        {
          q: "True or false: it's only domestic abuse if it's physical.",
          opts: ["True", "False"],
          a: 1,
          fb: "False, that's a common myth. Many people experience domestic abuse without ever being physically harmed: emotional, coercive, economic, tech and sexual abuse are all forms of domestic abuse.",
        },
        {
          q: "Which of these is a form of domestic abuse?",
          opts: [
            "Running up debts in someone's name",
            "Using GPS to track someone",
            "Making someone doubt their own memory",
            "All of these",
          ],
          a: 3,
          fb: "All of these. Economic abuse, tech abuse and gaslighting are all recognised forms of domestic abuse, and coercive control has been a criminal offence since 2015.",
        },
        {
          q: "Domestic abuse is best described as…",
          opts: [
            "A one-off argument that gets out of hand",
            "A pattern of behaviour used to control or gain power over a partner or ex-partner",
            "Something that only happens in certain communities",
          ],
          a: 1,
          fb: "Exactly. It's a pattern of controlling behaviour, and it is never the fault of the person experiencing it.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "Let's clear things up",
      kicker: "Myths and stigma",
      title: "Let's Clear a Few Things Up",
      blocks: [
        {
          kind: "lead",
          body: "We've all soaked up these ideas without meaning to. Not one of them is true, and every one of them keeps women silent. Tap each to turn it over.",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F6AA}",
              title: "“Why doesn't she just leave?”",
              body: "The most common question, and the one that misses the most.",
              more: "Because leaving is the most dangerous time of all: the risk of serious harm rises sharply when an abuser feels he is losing control. Because he may hold the money, the home, the car. Because of the children, or the pets, or having nowhere to go. And because she may still love him and hope he'll change back into the man she met. Leaving is rarely one decision. It is a dozen, made in fear, often over years.",
            },
            {
              emoji: "\u{1FA79}",
              title: "“If there are no bruises, it isn't really abuse.”",
              body: "Some of the deepest harm never shows on the skin.",
              more: "Coercive control, emotional abuse and financial abuse can be more damaging and harder to escape than physical violence, and survivors often say the mind games hurt the longest. All of them are abuse, and coercive control is a crime. You do not need to see an injury to take someone seriously.",
            },
            {
              emoji: "\u{1F60A}",
              title: "“But he's such a lovely bloke.”",
              body: "The charm is often part of how it works.",
              more: "Abusers are frequently warm, funny and well-liked in public. That public face is exactly why she fears no one will believe her, and why she may doubt herself. “He's so nice though” is one of the reasons abuse stays hidden. What happens behind closed doors is what counts.",
            },
            {
              emoji: "\u{1F910}",
              title: "“It's not really my business.”",
              body: "Silence is the one thing every abuser relies on.",
              more: "Abuse survives in secrecy and isolation. A kind word from someone outside the relationship, someone with no agenda, can be the moment a woman first realises that what is happening is not normal and not her fault. You are not interfering. You may be the one safe person who noticed.",
            },
            {
              emoji: "\u{1F30D}",
              title: "“It only happens to certain kinds of women.”",
              body: "There is no type. It reaches everywhere.",
              more: "Domestic abuse happens across every age, class, job, culture and postcode. It happens to confident women, successful women, women you would never guess. Believing it only happens to 'other' women is part of what stops so many from recognising it in themselves, or in the friend in the next chair.",
            },
            {
              emoji: "\u{1F6AB}",
              title: "“She must do something to provoke it.”",
              body: "Nothing anyone does makes them deserve abuse.",
              more: "Abuse is a choice the abuser makes, every time. Notice that he can control himself perfectly well in front of others, at work, in public. It is not a temper he cannot help. It is power used where he thinks no one is watching. It is never, ever her fault.",
            },
          ],
        },
        {
          kind: "note",
          align: "center",
          body: "Every one of these you let go of makes you a safer person to talk to.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "The most dangerous time",
      kicker: "Please remember this one",
      title: "Leaving Is the Most Dangerous Time",
      blocks: [
        {
          kind: "card",
          variant: "purple",
          body: "Leaving does not switch the danger off. It often turns it up. The weeks and months after a woman leaves are the **highest-risk time for serious harm, or murder**, because an abuser who has lost control may try to take it back any way he can.",
        },
        {
          kind: "lead",
          body: "And it is still domestic abuse once the relationship is over. Splitting up does not end it. It can be the moment it turns most dangerous.",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F441}",
              title: "It doesn't stop at the door",
              body: "Stalking, turning up, waiting outside, following her.",
            },
            {
              emoji: "\u{1F4F1}",
              title: "It follows her online",
              body: "Floods of messages, threats, tracking, using her accounts.",
            },
            {
              emoji: "\u{2696}\u{FE0F}",
              title: "It uses whatever it can",
              body: "The children, money, or the courts, to keep a hold on her.",
            },
          ],
        },
        {
          kind: "note",
          body: "This is called **post-separation abuse**, and it is a crime. So if a client tells you she's left, or that an ex won't leave her alone, that is not the moment to relax. **It's the moment to stay closest.**",
        },
      ],
    },
    {
      type: "content",
      navTitle: "Recognising the signs",
      kicker: "Section 02 · Recognising the signs",
      title: "What Might You Notice?",
      blocks: [
        {
          kind: "lead",
          body: "No single one of these proves anything, and you are not collecting evidence. It's the pattern, and your own gut, that matter. You are noticing, not diagnosing.",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F441}",
              title: "Injuries that don't add up",
              body: "Marks or bruises, or an explanation that doesn't quite fit.",
              more: "You know your clients' bodies and faces better than almost anyone. A bruise placed where it wouldn't happen by accident, an injury explained a little too quickly, the same clumsiness again and again. Long sleeves or a scarf in warm weather. You never have to be sure what happened. Noticing is enough.",
            },
            {
              emoji: "\u{1F636}",
              title: "A change in how she is",
              body: "Withdrawn, anxious or jumpy, especially when her partner is near.",
              more: "This is the one you feel more than see. The chatty regular who has gone quiet. Someone who watches the door, or brightens the second a partner steps out, then dims when they come back. You have known her long enough to feel the difference, and that felt sense is real information.",
            },
            {
              emoji: "\u{1F4F5}",
              title: "A partner who is always there",
              body: "Calling constantly, waiting outside, checking her phone.",
              more: "Control often looks like devotion from the outside. He drops her off and collects her. He rings to see how long she'll be. He needs to know who she's with. What looks like a doting partner can be someone who cannot let her out of sight, and she may be managing his mood the whole time she's in your chair.",
            },
            {
              emoji: "\u{1F4B8}",
              title: "Not being 'allowed'",
              body: "Talk of not being allowed to spend money, go out, or see people.",
              more: "Listen for the word 'allowed', and for plans that always need his say-so. 'I'd have to check.' 'He doesn't like me seeing them.' 'I'm not really allowed my own money.' Grown women asking permission for ordinary things is one of the clearest signals there is.",
            },
            {
              emoji: "\u{1F501}",
              title: "Appointments that keep falling through",
              body: "Cancelling often, with excuses that change or don't add up.",
              more: "Sometimes the abuse is in what you don't see. A client who suddenly can't keep appointments, whose reasons shift, who goes quiet for months. She may not be allowed to come, or may be hiding the money, or covering something she can't explain. A pattern of disappearing is worth holding in mind.",
            },
            {
              emoji: "\u{1F4AC}",
              title: "The throwaway comment",
              body: "'He'd go mad if he knew I was here.' Said lightly, meaning something heavier.",
              more: "The biggest things are often said as small jokes, testing whether it's safe to say more. 'He'd kill me if he saw this bill.' 'He'd go mad if he knew I was here.' It's easy to laugh along and move on. But a light comment about a partner's temper is often a toe in the water, and how you respond decides whether she wades in.",
            },
          ],
        },
        {
          kind: "note",
          align: "center",
          body: "You will not always be right, and you are not meant to be. You are just the person who notices, and stays warm.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "How people tell you",
      kicker: "Section 02 · Understanding disclosure",
      title: "How People Tell You",
      blocks: [
        {
          kind: "quote",
          text: "In all my years I've never had a client tell me they were experiencing domestic abuse. Though plenty have told me their partners were difficult.",
          cite: "Beauty professional, 15 years' experience",
        },
        {
          kind: "note",
          align: "center",
          body: "**She wasn't missing the will. She was missing the words.**",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F52C}",
              title: "It comes out in pieces",
              body: "Almost no one tells you everything the first time.",
              more: "Disclosure is rarely one big moment. It's a small comment dropped to see how you take it, then a little more next time if you passed. A woman is testing, often without knowing she's doing it, whether you're safe. Which means the tiny half-said thing you almost missed may be the first step of something she has never told anyone.",
            },
            {
              emoji: "\u{1F604}",
              title: "A joke is often a test",
              body: "'He's been such an idiot lately.' Said with a laugh, watching your face.",
              more: "Humour and playing-it-down are how people raise something frightening while keeping a way out. If you laugh it off, she has lost nothing and can retreat. If you soften and say 'that sounds hard, are you okay?', she learns it's safe to say more. The joke is the door. Your response decides if it opens.",
            },
            {
              emoji: "\u{1F442}",
              title: "She may be waiting to be asked",
              body: "Many women want to be asked, but will never bring it up first.",
              more: "It sounds backwards, but survivors often long for someone to gently ask, while being unable to volunteer it themselves. The shame is too big to go first. So the quiet 'you don't seem yourself, how are you?' is not nosy. For a woman who has been waiting years for anyone to notice, it can be the most important question she's been asked.",
            },
          ],
        },
      ],
    },
    {
      type: "content",
      navTitle: "Responding in the moment",
      kicker: "Section 02 · Responding in the moment",
      title: "You Don't Need to Know if It's Abuse",
      blocks: [
        {
          kind: "lead",
          body: "Your job is not to diagnose, label or investigate. It's simply to leave the door open.",
        },
        {
          kind: "hearRespond",
          pairs: [
            {
              hear: "He's been such an idiot lately.",
              respond: "That doesn't sound great. Are you okay?",
              why: "Simple. Non-intrusive. Opens the door.",
            },
            {
              hear: "Things have been really hard at home.",
              respond:
                "It sounds like things have been tough. Do you want to talk about it?",
              why: "Warm and inviting without pressure.",
            },
            {
              hear: "He doesn't really like me coming here.",
              respond:
                "I'm always here if you ever need to chat about anything.",
              why: "Plants a seed. No pressure to respond now.",
            },
          ],
        },
        {
          kind: "note",
          align: "center",
          body: "If it's nothing, she'll say so. If it's something, **you've just changed everything.**",
        },
      ],
    },
    {
      type: "content",
      navTitle: "A real story",
      kicker: "A real story",
      title: "Mel's Story",
      blocks: [
        {
          kind: "quote",
          variant: "purple",
          text: "Because she didn't rush in, didn't judge, didn't panic, I told her. Not my parents. Not my siblings. My lash tech.",
          cite: "Mel, survivor",
        },
        {
          kind: "lead",
          body: "**Her lash technician listened. You could be that person.**",
        },
        {
          kind: "details",
          summary: "Read Mel's full story, in her own words",
          paragraphs: [
            "The most important part of my story isn't the relationship itself. It's the moment I told someone. After one of the worst moments of my life, when I'd had to call the police after an attack, I went to my lash appointment like normal. I was lying on the lash bed, chatting about everyday life, the way we always did. Then she asked me how my partner was. And I froze. Completely.",
            "She noticed instantly. She saw the bruises. She saw the shift in my face. And without pushing, without making it uncomfortable, without demanding answers, she simply changed her tone and made space. That space is what mattered.",
            "As a victim of domestic abuse, you're conditioned to feel shame. You're conditioned to believe it's your fault. You're conditioned not to speak about it. Keeping the secret becomes part of your survival. So even forming the words felt enormous. Everything in me wanted to laugh it off, change the subject, say I was fine. But because she didn't rush in, didn't judge, didn't panic, I told her. Not my parents. Not my siblings. My lash tech.",
            "Tilly became my unpaid therapist without ever signing up for the role. She listened while I tried to process what had happened. She reassured me when I questioned myself. Most importantly, she believed me. She didn't gossip. She didn't dramatise it. She didn't try to rescue me. She simply showed up, appointment after appointment, creating a safe space where I could speak freely. That's what disclosure needs. Safety. Calm. Belief.",
            "In most careers, especially in the beauty industry, you're trained in treatments and techniques. You're not taught what to do when someone quietly discloses abuse halfway through an appointment. Thankfully, Tilly instinctively knew how to hold that moment. But instinct isn't something everyone can rely on.",
            "Because the person someone tells first matters. How you respond in that first moment matters. Whether you create safety or shut it down matters. You're not there to fix someone's life. You're not expected to have all the answers. But you might be the first person who makes it safe enough for someone to say, “This is happening to me.” And that moment, that disclosure, can be the beginning of everything changing.",
            "Because sometimes the bravest thing a victim does isn't leaving. It's telling. And that's not gossip. That's the start of someone getting their power back.",
          ],
        },
      ],
    },
    {
      type: "quiz",
      navTitle: "Knowledge check",
      kicker: "Knowledge check · Section 02",
      title: "Quick Check",
      questions: [
        {
          q: "A client laughs and says 'he's been such an idiot lately.' What might this be?",
          opts: [
            "Just a joke, best ignored",
            "A possible safety test: a way of raising the subject while keeping an escape route",
            "A sign you should ask detailed questions about her relationship",
          ],
          a: 1,
          fb: "Humour and minimising language are known disclosure strategies. A warm, low-pressure response ('that doesn't sound great, are you okay?') leaves the door open without forcing anything.",
        },
        {
          q: "Research shows survivors often…",
          opts: [
            "Disclose everything the first time they mention it",
            "Want to be asked directly, but won't volunteer it unprompted",
            "Prefer never to be asked",
          ],
          a: 1,
          fb: "They test reactions gradually, and many are waiting to be asked. Your calm reaction to a small comment decides whether it feels safe to say more.",
        },
        {
          q: "Which of these could be a sign something is wrong?",
          opts: [
            "A pattern of cancelled appointments with changing excuses",
            "A partner calling repeatedly or waiting outside",
            "Talk of not being 'allowed' to spend money or see people",
            "All of these",
          ],
          a: 3,
          fb: "All of these are signs you might notice. No single sign is proof. Your job isn't to diagnose, just to notice and leave the door open.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "Responding to a disclosure",
      kicker: "Section 03 · How to respond",
      title: "If a Client Opens Up to You",
      blocks: [
        {
          kind: "numbered",
          items: [
            {
              title: "Listen",
              body: "Stay calm. Give them your full attention. Don't rush, interrupt, or show shock.",
            },
            {
              title: "Believe",
              body: "Tell them you believe them. Avoid minimising or questioning their experience.",
            },
            {
              title: "Support",
              body: "Ask how you can help. Let them lead. Don't pressure them to act or leave.",
            },
            {
              title: "Signpost",
              body: "Share safe resources gently. You don't need all the answers, just point the way.",
            },
          ],
        },
      ],
    },
    {
      type: "content",
      navTitle: "What NOT to do",
      kicker: "Section 03 · How to respond",
      title: "What NOT To Do",
      blocks: [
        {
          kind: "lead",
          body: "These aren't rules to catch you out. Each one exists because getting it wrong, with the best of intentions, can make a woman less safe. Tap any to see why.",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F6AB}",
              title: "Don't investigate",
              body: "You are not the police. Resist the urge to gather the facts.",
              more: "When someone we care about is hurting, we want the whole story so we can help. But a string of questions can feel like an interrogation, and it can frighten a woman into shutting down. She doesn't need you to establish what happened. She needs to feel it was safe to say the little she did.",
            },
            {
              emoji: "\u{1F6AB}",
              title: "Don't confront the abuser",
              body: "Never contact or challenge him, however tempting.",
              more: "It feels like standing up for her. In reality it can be the most dangerous thing you could do. An abuser who feels exposed or challenged often takes it out on her the moment they're alone. Your anger is understandable. Keep it well away from him, for her sake.",
            },
            {
              emoji: "\u{1F6AB}",
              title: "Don't push her to leave",
              body: "Leaving is the most dangerous time. Let her lead.",
              more: "'Why doesn't she just leave' is the question everyone asks, and the answer is that leaving is when women are most often seriously hurt or killed. She knows her own risk better than anyone. Your job is not to get her out. It's to make sure she knows the door is open whenever she's ready.",
            },
            {
              emoji: "\u{1F6AB}",
              title: "Don't promise total secrecy",
              body: "Be warm, but honest about your limits.",
              more: "It's tempting to promise you'll never tell a soul, because you want her to trust you. But if a child is at risk, you may need to pass that on. Better to say something gentle and true: 'I'm here, and I'll always be honest with you about anything that worries me for someone's safety.'",
            },
            {
              emoji: "\u{1F6AB}",
              title: "Don't leave a trail",
              body: "Share nothing where he might see or hear it.",
              more: "Abusers often check phones, bank statements, browser history and messages. A helpline number saved in her phone, a leaflet in her bag, a text from you, any of it can be found and can put her in danger. Only ever pass things on in a way she can keep truly private, and follow her lead on what's safe.",
            },
            {
              emoji: "\u{1F6AB}",
              title: "Don't forget your own safety",
              body: "You matter too. Never put yourself at risk.",
              more: "You are a link to help, not a rescuer, and you can't be either if you're hurt or overwhelmed. Don't step between anyone, don't take risks, and don't carry it all alone afterwards. Looking after yourself is part of doing this well, not a distraction from it.",
            },
          ],
        },
      ],
    },
    {
      type: "quiz",
      navTitle: "Case study: Emma",
      kicker: "Let's think about this together",
      title: "Case Study: Emma",
      intro: [
        {
          kind: "card",
          body: "Emma has been coming to the salon for three years. She's always been chatty and warm. Today she seems quiet. She's wearing long sleeves despite the warm weather. When you ask how she's doing, she says “fine”, but then pauses and says *“actually, things have been really hard at home lately.”* Her partner is waiting outside.",
        },
      ],
      questions: [
        {
          q: "1 · What do you notice in this moment?",
          opts: [
            "She said 'fine', so probably nothing",
            "Several possible signs: the change in mood, long sleeves in warm weather, 'hard at home', and the partner waiting outside",
            "Definite proof of abuse",
          ],
          a: 1,
          fb: "You've noticed a cluster of possible signs. None of them are proof, and they don't need to be. Your job is never to diagnose; it's to leave the door open.",
        },
        {
          q: "2 · What would you do first?",
          opts: [
            "Ask her directly if her partner is hurting her",
            "Respond gently and leave the door open: 'It sounds like things have been tough. Do you want to talk about it?'",
            "Tell her she should think about leaving him",
            "Go outside and have a word with her partner",
          ],
          a: 1,
          fb: "Warm and inviting, without pressure. She's testing whether it's safe to say more, and your calm response is what makes it safe. Confronting the partner or pushing for details could put her in danger.",
        },
        {
          q: "3 · Her partner is waiting outside. What matters most right now?",
          opts: [
            "Getting her to tell you everything before she leaves",
            "Keeping things looking calm and normal, and never sharing anything where he might see or hear it",
            "Writing the helpline number on her appointment card in big letters",
          ],
          a: 1,
          fb: "Her safety comes first. Keep the appointment looking ordinary, don't share information the abuser might access, and only pass on resources in a way that's safe. She may not be able to take anything home with her today.",
        },
      ],
    },
    {
      type: "quiz",
      navTitle: "Knowledge check",
      kicker: "Knowledge check · Section 03",
      title: "Quick Check",
      questions: [
        {
          q: "A client opens up to you. What comes first?",
          opts: [
            "Give advice on what she should do",
            "Listen: stay calm, give full attention, don't show shock",
            "Ask questions to work out if it's really abuse",
          ],
          a: 1,
          fb: "Listen, Believe, Support, Signpost, in that order. Staying calm and not showing shock keeps the space safe.",
        },
        {
          q: "Which of these should you NOT do?",
          opts: [
            "Tell her you believe her",
            "Let her lead the conversation",
            "Pressure her to leave her partner",
            "Gently share the helpline number when it's safe",
          ],
          a: 2,
          fb: "Never pressure someone to leave. Leaving is statistically the most dangerous time. Let them lead.",
        },
        {
          q: "A client asks you to promise to keep it secret no matter what. You should…",
          opts: [
            "Promise, she trusted you",
            "Be honest about your limits, e.g. if a child were at risk",
            "Refuse to discuss it further",
          ],
          a: 1,
          fb: "Don't promise confidentiality you can't keep. Be warm but honest about your limits, especially where children may be at risk.",
        },
      ],
    },
    {
      type: "content",
      navTitle: "Looking after yourself",
      kicker: "Section 04 · Looking after yourself",
      title: "Protecting Your Own Wellbeing",
      blocks: [
        {
          kind: "lead",
          body: "Holding space for someone else's pain has a cost, and you matter in this too. Looking after yourself isn't selfish here. It's what lets you keep showing up.",
        },
        {
          kind: "tiles",
          items: [
            {
              emoji: "\u{1F9D8}",
              title: "You don't have to have all the answers",
              body: "Listen and point the way. That is already enough.",
              more: "The pressure to fix it is where the exhaustion comes from. But you were never meant to be her therapist, her lawyer or her rescuer. You are the warm person who noticed and pointed to help. That is a complete and important job on its own, and letting go of the rest protects you both.",
            },
            {
              emoji: "\u{1F5E3}",
              title: "Don't carry it alone",
              body: "If a conversation stays with you, tell someone you trust.",
              more: "Some things a client says will follow you home. That's not weakness, it's being human. Speak to a manager or a colleague you trust, without breaking her privacy, or call a helpline yourself, they support the people around survivors too. Saying it out loud to someone safe stops it sitting on your chest.",
            },
            {
              emoji: "\u{1F4CB}",
              title: "A note can help, kept carefully",
              body: "You might jot down what was said and when.",
              more: "If you're comfortable, a short private note of what was said and when can matter later, especially if things ever reach the police or a court. Keep it somewhere secure that no one else can see, never on a shared salon system, and only if it doesn't put you or her at any risk.",
            },
            {
              emoji: "\u{1F6E1}",
              title: "Trust your own instincts",
              body: "If anything ever feels unsafe for you, act on it.",
              more: "Occasionally a partner's behaviour towards you, not just her, sets off an alarm. Listen to it. Don't get between them, don't confront anyone, and get advice or step back if you need to. Your safety is never the price of helping someone else.",
            },
          ],
        },
      ],
    },
    {
      type: "content",
      navTitle: "What does the law say?",
      kicker: "Section 04 · Legal context",
      title: "What Does the Law Say?",
      blocks: [
        {
          kind: "card",
          variant: "purple",
          body: "As a salon professional, you have **no legal duty to report**. But you do have a moral opportunity, and this training gives you the confidence to use it.",
        },
        {
          kind: "tiles",
          items: [
            {
              title: "Domestic Abuse Act 2021",
              body: "Domestic abuse is now recognised in law in England and Wales.",
              more: "The Act put a legal definition of domestic abuse into law for the first time, and named children who see or hear abuse as victims in their own right. You don't need to know the detail. What matters is that the law is firmly on the side of the person being harmed, and treats this as the serious thing it is.",
            },
            {
              title: "Coercive control is a crime",
              body: "Controlling or coercing a partner has been illegal since 2015.",
              more: "This is the important one, because it means abuse does not have to be physical to be a crime. A pattern of controlling, isolating, frightening or degrading someone is a criminal offence, even if he never lays a hand on her. It's the law catching up with what survivors always knew: the control is the abuse.",
            },
            {
              title: "Children change things",
              body: "If a child is at risk, there is a duty to refer to children's services.",
              more: "For adults, no one is obliged to report. But where a child may be at risk of harm, that shifts, and it's right to pass your concern to children's services. You don't have to be certain, and you're not making an accusation. Concern is enough, and it's their job to look into it, not yours.",
            },
            {
              title: "Your role stays simple",
              body: "You are not expected to gather evidence or judge. Listen. Signpost.",
              more: "None of this turns you into an investigator or a witness. You don't weigh up whether it's 'really' abuse or whether she should be believed. You listen, you stay kind, and you point toward help. The law does the heavy lifting from there.",
            },
          ],
        },
      ],
    },
    {
      type: "content",
      navTitle: "Where to direct someone",
      kicker: "Section 04 · Signposting: national",
      title: "Where to Direct Someone for Help",
      blocks: [
        {
          kind: "tiles",
          items: [
            {
              title: "National Domestic Abuse Helpline",
              body: "**0808 2000 247** · free, 24/7. Run by Refuge. Always the first number to share.",
            },
            {
              title: "999 / Silent 999",
              body: "Dial **999**, then press **55** if unable to speak. Always the first call in an emergency.",
            },
            {
              title: "Women's Aid",
              body: "womensaid.org.uk. Live chat, local services, online support.",
            },
            {
              title: "Men's Advice Line",
              body: "**0808 801 0327**. Confidential support for male victims.",
            },
            {
              title: "SafeLives",
              body: "safelives.org.uk. Safety planning tools and professional resources.",
            },
            {
              title: "The Hideout",
              body: "thehideout.org.uk. Support for children and young people.",
            },
          ],
        },
      ],
    },
    {
      type: "content",
      navTitle: "Local support",
      kicker: "Section 04 · Signposting: local",
      title: "Support in Cheshire & Merseyside",
      blocks: [
        {
          kind: "note",
          align: "center",
          body: "\u{1F6A8} **Wirral 24hr Helpline · 0151 643 9766** · free, any time, day or night",
        },
        {
          kind: "tiles",
          items: [
            {
              title: "The Lighthouse Centre",
              body: "**0151 644 4839**. Drop-in Mon to Thu 9:30am to 3pm. Women and children. Emotional support, safety planning.",
            },
            {
              title: "Wirral Domestic Abuse Hub",
              body: "**dahub@wirral.gov.uk**. Supports victim/survivors, children and those who cause harm.",
            },
            {
              title: "Tomorrow's Women Wirral",
              body: "**0151 647 7907**. Women-only safe space. Free support, courses and activities.",
            },
            {
              title: "Wirral Women & Children's Aid",
              body: "**0151 643 9766**. Safe refuge, outreach and 24hr support for women and children.",
            },
            {
              title: "Paul Lavelle Foundation",
              body: "**0151 651 3777**. Therapeutic support for men experiencing domestic abuse.",
            },
          ],
        },
      ],
    },
    {
      type: "quiz",
      navTitle: "Knowledge check",
      kicker: "Knowledge check · Section 04",
      title: "Quick Check",
      questions: [
        {
          q: "As a salon professional, what is your legal position?",
          opts: [
            "You must report all suspected abuse to police",
            "No legal duty to report for adults, but if a child is at risk, refer to children's services",
            "You could be prosecuted for not reporting",
          ],
          a: 1,
          fb: "You have no legal duty to report for adults. For children, concern is enough to refer. You don't have to be certain.",
        },
        {
          q: "Someone is in immediate danger but can't speak on the phone. What do they do?",
          opts: [
            "Text a friend",
            "Dial 999, then press 55 when prompted",
            "Wait until it's safe to call",
          ],
          a: 1,
          fb: "999 then 55. Silent 999 alerts the operator that the caller can't speak. Always the first call in an emergency.",
        },
        {
          q: "Which number is 'always the first number to share' with someone experiencing abuse?",
          opts: [
            "0808 2000 247, the National Domestic Abuse Helpline",
            "The local council switchboard",
            "Your salon's landline",
          ],
          a: 0,
          fb: "0808 2000 247: free, 24/7, run by Refuge. It's also at the bottom of every page of this training.",
        },
      ],
    },
    {
      type: "survey",
      navTitle: "One last thing",
      phase: "post",
      kicker: "Before you go",
      title: "One Last Thing!",
      intro:
        "Please rate yourself on the same questions as before. Your responses help us measure the impact of this training. Thank you!",
    },
    {
      type: "finish",
      navTitle: "Thank you",
      kicker: "Together, we can make a difference",
      title: "Thank You",
      blocks: [
        {
          kind: "quote",
          text: "Sometimes the bravest thing a victim does isn't leaving. It's telling. And that's not gossip. That's the start of someone getting their power back.",
          cite: "Mel, survivor",
        },
        {
          kind: "card",
          align: "center",
          body: "For questions or to find out more about our training:\n**hello@itsnotgossip.org** · **itsnotgossip.org**",
        },
      ],
    },
  ],
};
