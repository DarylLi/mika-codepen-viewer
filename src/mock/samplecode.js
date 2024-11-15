export default {
    html: "<p class=\"drop\">Call me Ishmael. Some years ago--never mind how long\n    precisely--having little or no money in my purse, and nothing\n    particular to interest me on shore, I thought I would sail about a\n    little and see the watery part of the world. It is a way I have of\n    driving off the spleen and regulating the circulation. Whenever I\n    find myself growing grim about the mouth; whenever it is a damp,\n    drizzly November in my soul; whenever I find myself involuntarily\n    pausing before coffin warehouses, and bringing up the rear of every\n    funeral I meet; and especially whenever my hypos get such an upper\n    hand of me, that it requires a strong moral principle to prevent me\n    from deliberately stepping into the street, and methodically knocking\n    people's hats off--then, I account it high time to get to sea as soon\n    as I can. This is my substitute for pistol and ball. With a\n    philosophical flourish Cato throws himself upon his sword; I quietly\n    take to the ship. There is nothing surprising in this. If they but\n    knew it, almost all men in their degree, some time or other, cherish\n    very nearly the same feelings towards the ocean with me.</p>\n   \n   <!-- Opening paragraph of Moby-Dick by Herman Mellville: https://en.wikipedia.org/wiki/Moby-Dick -->",
    css: "@import url(\"https://fonts.googleapis.com/css2?family=Eagle+Lake&family=Roboto+Slab&display=swap\");\n\n        body {\n            display: flex;\n            justify-content: center;\n        }\n        p {\n            max-width: 50%;\n            font-size: 20px;\n            text-align: justify;\n            font-family: \"Eagle Lake\", serif;\n            font-weight: 400;\n            font-style: normal;\n        }\n        \n        p::first-letter {\n            -webkit-initial-letter: 12;\n            initial-letter: 12;\n            margin: -1em 18px -24px 0;\n            color: transparent;\n            background: url(https://assets.codepen.io/11614/william-morris-letter-a.svg)\n                no-repeat 0 0 / contain;\n        }\n        \n        .c::first-letter {\n            background-image: url(https://assets.codepen.io/11614/william-morris-letter-c.svg);\n        }\n"
};