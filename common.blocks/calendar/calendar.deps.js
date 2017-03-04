[{
        mustDeps:
            { block: 'i-bem-dom' },
        shouldDeps: [
            { block: 'jquery', elem: 'event', mods: { type: 'pointer' } },

            {
                elems: ['arrow', 'day', 'dayname','title','layout','weeks']
            },
            {
                mods: { theme: 'islands' }
            }
        ]
    },
    {
        tech: 'js',
        shouldDeps: {
            tech: 'bemhtml'
        }
    }
];
