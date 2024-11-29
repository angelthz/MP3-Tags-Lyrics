export const Queue = () => {
    let arr = null;

    initializeQueue();

    //intializes an empty queue
    function initializeQueue() {
        arr = [];
    }

    //check if queue is empty
    function isEmpty() {

        return arr.length == 0 ? true : false;
    }

    //add a new value to the queue
    function add(value) {
        try {
            if (arr)
                arr.push(value);
            else
                throw new Error("Try to push a value on un-initialized Queue")
        }
        catch (e) {
            console.error(e);
        }
    }

    //removes the first element in the queue
    function remove() {
        try {
            if (!isEmpty())
                arr.shift();
            else
                throw { msg: "Attempt a remove operation on an empty Queue" }
        }
        catch (e) {
            console.warn(e.msg);
        }
    }

    //return the last element on the queue
    function rear() {
        return arr[arr.length - 1];
    }

    //return the first element on the queue
    function front() {
        return arr[0];
    }

    //return all queue
    function getQueue() {
        return arr;
    }

    //show items in the queue
    function show() {
        console.log(arr);
    }

    //clear the queue
    function clear() {
        arr = [];
    }

    //size returns the total number of elements it contains
    function size() {
        return arr.length;
    }

    return {
        add,
        remove,
        rear,
        front,
        getQueue,
        isEmpty,
        show,
        clear,
        size
    }

}