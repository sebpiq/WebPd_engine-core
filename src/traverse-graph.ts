type GraphTraversal = Array<PdDspGraph.Node>

export default (
    graph: PdDspGraph.Graph,
    registry: PdRegistry.Registry
): GraphTraversal => {
    const sinkNodes = Object.values(graph).filter((node) => {
        const nodeTemplate = registry[node.type]
        if (!nodeTemplate) {
            throw new Error(`Unknown node type ${node.type}`)
        }
        return nodeTemplate.isSink()
    })
    const traversal: GraphTraversal = []
    sinkNodes.forEach((sinkNode) =>
        recursiveTraverse(traversal, [], graph, sinkNode)
    )
    return traversal
}

const recursiveTraverse = (
    traversal: GraphTraversal,
    currentPath: GraphTraversal,
    graph: PdDspGraph.Graph,
    node: PdDspGraph.Node
) => {
    const nextPath = [...currentPath, node]
    Object.values(node.sources).forEach((sourceAddress) => {
        const sourceNode = graph[sourceAddress.id]
        if (!sourceNode) {
            throw new Error(`Unknown node with id ${sourceAddress.id}`)
        }
        if (currentPath.indexOf(sourceNode) !== -1) {
            return
        }
        recursiveTraverse(traversal, nextPath, graph, sourceNode)
    })
    if (traversal.indexOf(node) === -1) {
        traversal.push(node)
    }
}
