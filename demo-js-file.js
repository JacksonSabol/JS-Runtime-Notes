class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority; // This is only necessary if the values do not correspond to a priority
        // this.next = null; // This is only necessary if doing the implementation with a linked list instead of an array
    }
}

class PriorityQueue {
    constructor() {
        // We represent heaps as sort-of trees, but they’re not stored as trees in memory
        // We can use arrays or linked lists to store 
        // Add an initial value to the heap of null, so that we offset the array index by 1
        // This just makes the accessing calculations easier to understand
        this.heap = [null];
    }

    insert(value, priority) {
        // The first step for inserting into any heap is to simply add it to the next available leaf-space
        // In this case, the next available leaf-space is simply the end of the array
        // So we structure the new queue node and push it to the end of the heap array
        const newNode = new Node(value, priority);
        this.heap.push(newNode);
        // After that, we want to re-order the heap/queue if necessary to accommodate the new node and it's value/priority
        // First, we'll get a reference to the new nodes index
        let currentNodeIdx = this.heap.length - 1; // As above, this will always be the end of the array because we simply push nodes in then reorder them
        // Then we'll get a reference to the parent node's index, which will always be i / 2 in the array representation of a priority queue
        // In the case where the parent does not have exactly 2 children, the calculation will leave a decimal value, so we simply round down
        let currentParentNodeIdx = Math.floor(currentNodeIdx / 2);
        // Then we iteratively consider the values/priorities of parent and children to reorder every necessary node until we have a proper max heap again
        while(
            // Only do work while there is a parent node, meaning once we've reached the top of the heap, stop reordering
            this.heap[currentParentNodeIdx] &&
            // Only do reordering work while the value/priority of the current node is greater than the value/priority of the parent node (definition of max heap)
            newNode.priority > this.heap[currentParentNodeIdx].priority
        ) {
            // If we've made it through those conditions, we need to swap the parent node and the new node
            // Start by accessing the parent node
            const parentNode = this.heap[currentParentNodeIdx];
            // Once we have that, we can replace the array value at the parent node (parent index) with the new node
            this.heap[currentParentNodeIdx] = newNode;
            // Then we replace the array value at the child node's index with the parent node, which we got reference to above
            this.heap[currentNodeIdx] = parentNode;
            // Then we prepare our tracker indices for reconsideration with the newNode's new parent node
            // We simply swap the current node's index for the parent node's index since they've swapped places
            currentNodeIdx = currentParentNodeIdx;
            // Then we calculate the new parent node index using the relationship between parent and child nodes in the heap array representation, i / 2
            // This is the same step as when we started
            currentParentNodeIdx = Math.floor(currentNodeIdx / 2);
        }
    }

    remove(){
        // The first step to removing a value is pretty straightforward, simply pop the value off the top of the array representation
        // In a priority queue, min-heap or max-heap, the highest priority element is always at the top
        // However, in our implementation, we have set the first "node" to null so that we can more easily understand the indices and parent/child relationships
        // So we should get the second element in the array
        // const node = this.heap[1];
        // Then, we pop off the last element of the heap, and set it to be our first element
        // This is so that we can respect the rules of a complete binary heap:
        // "Every level of the heap must be full, except the lowest level, which fills left to right"
        // this.heap[1] = this.heap.pop();

        // But before even doing that, let's check for an edge case where the heap only has one element left
        if(this.heap.length < 3) {
            // Pop off the top node, regardless of whether it's null, to prepare to return it
            const toReturn = this.heap.pop();
            // Set the 0th (first actual) node to null to cover when that's our last node
            this.heap[0] = null;
            // then return the top node
            return toReturn;
        }
        // This accounts for the fact that if we replace the first element in the heap with this.heap.pop(), we are replacing that element with itself
        // It also handles the case of an empty heap by returning null and replacing the zero index of the heap with a new null value

        // Now get reference to the first node so we can return it (remove it) at the end
        const toRemove = this.heap[1];
        // Then get the last node in the heap and place it on top
        this.heap[1] = this.heap.pop();

        // Then afterwards, we will reorder the heap/priority queue iteratively
        // To begin considering whether the last node popped should be a parent or a child, set an index equal to it's position in the array representation
        let currentIdx = 1;
        // Get a reference to each child, left and right, of the last node for an array representation 
        // The left child of any parent node in a binary tree/max-heap/priority queue will always be 2 * i. You can draw the binary tree and look at the array to figure this out, following nodes left to right then parent to child
        // The right child of any parent node will always be 2 * i + 1. Same note as above
        let [left, right] = [(2 * currentIdx), ((2* currentIdx) + 1)];
        // Next, determine which child of the node has a greater priority with respect to each other, so that we may consider it against the parent after
        // We will keep reference to the index in our array representation, and use that to compare value/priorities
        // Also, we will check to make sure there even is a right child, since we fill nodes left to right on the bottom level, it might be empty while the left is not
        let currentChildIdx = this.heap[right] && this.heap[left].priority >= this.heap[right].priority ? left : right;

        // Then, we iteratively swap nodes if the child nodes are of greater priority than the parent nodes
        // Also, we will check to make sure we have a child node to consider. The above statement evaluates to false when there are no children remaining
        while(this.heap[currentChildIdx] && this.heap[currentIdx].priority <= this.heap[currentChildIdx].priority) {
            // Get a temp reference to the parent node
            const parentNode = this.heap[currentIdx];
            // Swap the parent node with the child node of greater priority 
            this.heap[currentIdx] = this.heap[currentChildIdx];
            // Then swap the child node with the parent node through the temp reference
            this.heap[currentChildIdx] = parentNode;
        }

        // Finally, return the removed node
        return toRemove;
    }
}

// Test
const elms = [['play', 1], ['eat', 10], ['pee', 3], ['poop', 7], ['be happy', 5]]
const pQueue = new PriorityQueue();
elms.forEach(elm => {
    pQueue.insert(elm[0], elm[1]);
});
// console.log(pQueue);
const sorted = [];
let activity = pQueue.remove();
while(activity) {
    sorted.push(activity);
    activity = pQueue.remove();
}
sorted.forEach(heapItem => {
    print("Activity: " + heapItem.val + ". Priority: " + heapItem.priority + ".");
});
// Uncomment last line and run with Node.js to see the full pretty-printed result of sorted
// The jsc print method doesn't automatically pretty-print objects
// console.log(sorted);