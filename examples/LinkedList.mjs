import assert from 'assert';

class LinkedList {
    *#moveToEnd(head) {
        let current = head;
        while (current.next != null) {
            current = current.next;
            yield current;
        }
        return current;
    }
    append(head, data){
        const newNode = { data, next: null };
        if(head == null) return newNode;
        let current = head;
        for(current of this.#moveToEnd(current)){}
        current.next = newNode;
        return head;
    }
    prepend(head, data){
        return { data, next: head };
    }
    length(head){
        let count = 0;
        let current = head;
        if(current != null) count++;
        for(current of this.#moveToEnd(current)) count++;
        return count;
    }
}
describe('linked list', ()=>{
    it('Prepend items', ()=>{
        const list = new LinkedList();
        let head = list.prepend(null, 'f');
        head = list.prepend(head, 'e');
        head = list.prepend(head, 'd');
        head = list.prepend(head, 'c');
        head = list.prepend(head, 'b');
        const expected = 5;
        const actual = list.length(head);
        assert.equal(actual, expected);
        assert.equal(head.data, 'b');
    });
    it('Append items', ()=>{
        const list = new LinkedList();
        let head = list.append(null, 'a');
        head = list.append(head, 'b');
        head = list.append(head, 'c');
        head = list.append(head, 'd');
        head = list.append(head, 'e');
        const expected = 5;
        const actual = list.length(head);
        assert.equal(actual, expected);
        assert.equal(head.data, 'a');
    });
});