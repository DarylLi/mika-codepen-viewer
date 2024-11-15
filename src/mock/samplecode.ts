export default {
  html: `<p class="drop">Call me Ishmael. Some years ago--never mind how long
    precisely--having little or no money in my purse, and nothing
    particular to interest me on shore, I thought I would sail about a
    little and see the watery part of the world. It is a way I have of
    driving off the spleen and regulating the circulation. Whenever I
    find myself growing grim about the mouth; whenever it is a damp,
    drizzly November in my soul; whenever I find myself involuntarily
    pausing before coffin warehouses, and bringing up the rear of every
    funeral I meet; and especially whenever my hypos get such an upper
    hand of me, that it requires a strong moral principle to prevent me
    from deliberately stepping into the street, and methodically knocking
    people's hats off--then, I account it high time to get to sea as soon
    as I can. This is my substitute for pistol and ball. With a
    philosophical flourish Cato throws himself upon his sword; I quietly
    take to the ship. There is nothing surprising in this. If they but
    knew it, almost all men in their degree, some time or other, cherish
    very nearly the same feelings towards the ocean with me.</p>
   
   <!-- Opening paragraph of Moby-Dick by Herman Mellville: https://en.wikipedia.org/wiki/Moby-Dick -->`,
        css:`@import url("https://fonts.googleapis.com/css2?family=Eagle+Lake&family=Roboto+Slab&display=swap");

        body {
            display: flex;
            justify-content: center;
        }
        p {
            max-width: 50%;
            font-size: 20px;
            text-align: justify;
            font-family: "Eagle Lake", serif;
            font-weight: 400;
            font-style: normal;
        }
        
        p::first-letter {
            -webkit-initial-letter: 12;
            initial-letter: 12;
            margin: -1em 18px -24px 0;
            color: transparent;
            background: url(https://assets.codepen.io/11614/william-morris-letter-a.svg)
                no-repeat 0 0 / contain;
        }
        
        .c::first-letter {
            background-image: url(https://assets.codepen.io/11614/william-morris-letter-c.svg);
        }
`        
};
