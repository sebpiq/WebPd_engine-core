/*
 * Copyright (c) 2012-2020 Sébastien Piquemal <sebpiq@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/sebpiq/WebPd_pd-parser for documentation
 *
 */

import assert from 'assert'
import {
    makeGraph,
    makeRegistry,
    nodeDefaults,
} from '@webpd/shared/test-helpers'
import traverseGraph from './traverse-graph'

describe('traverse-graph', () => {
    const DUMMY_REGISTY = makeRegistry({
        DUMMY: {},
        DUMMY_SINK: { isSink: true },
    })

    it('traverses a graph with different levels in the right order', () => {
        // [  n1  ]
        //   |   \
        //   |  [  n2  ]
        //   |   /
        // [  n3  ]
        const graph = makeGraph({
            n1: {
                sinks: {
                    0: [
                        ['n3', 0],
                        ['n2', 1],
                    ],
                },
            },
            n2: {
                sinks: {
                    0: [['n3', 1]],
                },
            },
            n3: {
                type: 'DUMMY_SINK',
            },
        })
        const traversal = traverseGraph(graph, DUMMY_REGISTY)
        assert.deepStrictEqual(
            traversal.map((node) => node.id),
            ['n1', 'n2', 'n3']
        )
    })

    it('traverses the reversed graph with different levels in the right order', () => {
        //    [  n1  ]
        //     /    |
        // [  n2  ] |
        //     \    |
        //    [  n3  ]
        const graph = makeGraph({
            n1: {
                sinks: {
                    0: [
                        ['n2', 0],
                        ['n3', 1],
                    ],
                },
            },
            n2: {
                sinks: {
                    0: [['n3', 0]],
                },
            },
            n3: {
                type: 'DUMMY_SINK',
            },
        })
        const traversal = traverseGraph(graph, DUMMY_REGISTY)
        assert.deepStrictEqual(
            traversal.map((node) => node.id),
            ['n1', 'n2', 'n3']
        )
    })

    it('traverses fine with a loop in the graph', () => {
        //           /\
        //    [  n1  ] |
        //     |       |
        //     |       |
        //     |       |
        //    [  n2  ]/
        const graph = makeGraph({
            n1: {
                sinks: {
                    0: [['n2', 0]],
                },
            },
            n2: {
                type: 'DUMMY_SINK',
                sinks: {
                    0: [['n1', 0]],
                },
            },
        })
        const traversal = traverseGraph(graph, DUMMY_REGISTY)
        assert.deepStrictEqual(
            traversal.map((node) => node.id),
            ['n1', 'n2']
        )
    })

    it('raises error if unknown node type', () => {
        const graph = makeGraph({
            n1: {
                type: 'n_unknown',
                sinks: {},
            },
        })
        assert.throws(() => traverseGraph(graph, DUMMY_REGISTY))
    })

    it('raises error if unknown source id', () => {
        const graph: PdDspGraph.Graph = {
            n1: nodeDefaults('n1'),
            n2: {
                ...nodeDefaults('n2'),
                type: 'DUMMY_SINK',
                sources: {
                    0: { id: 'n_unknown', portlet: 0 },
                },
            },
        }
        assert.throws(() => traverseGraph(graph, DUMMY_REGISTY))
    })
})
