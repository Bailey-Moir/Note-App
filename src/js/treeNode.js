class TreeNode {
    parent = null;
    children = [];
    name = "";
    depth = 0;
    index = 0;
    content = "";

    static indexKey = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
    ];

    constructor(parent, name, depth, index, content) {
        this.name = name;
        this.parent = parent;
        this.depth = depth;
        this.index = index;
        this.content = content;

        parent && this.parent.children.push(this)
    }

    static decompile() {
        const array = localStorage.getItem('raw').split(' #');
        const root = new TreeNode(
            undefined,
            "Home",
            0,
            0,
            array[0]
        );
        let node = root;
        for (let i = 1; i < array.length; i++) {
            const depth = array[i].length - array[i].replaceAll('#', '').length + 1;
    
            let parent;
            if (depth > node.depth) parent = node;
            else if (depth === node.depth) parent = node.parent;
            else {
                parent = node.parent.parent;
                for (let i = 1; i < node.depth - depth; i++) parent = parent.parent;
            }
            
            node = new TreeNode(
                parent,
                array[i].replaceAll('#', '').split('\n')[0].trim(),
                depth,
                parent.children.length,
                array[i].split('\n').slice(1).join('\n')
            );
        }
    
        return root;
    }

    followPath(linkIndices) {
        const next = this.children[TreeNode.indexKey.indexOf(linkIndices[0])];
        return linkIndices.length != 1 ? next.followPath(linkIndices.slice(1)) : next;
    }

    linkIndices() {
        for (var i = this, value = ""; i.parent; i = i.parent) value = TreeNode.indexKey[i.index] + value;
        return value;
    }

    compile() {
        let output = "";
        
        let node = this;
        let finishedChildren = false;
        const findNext = () => {
            if (node == null) return;
            else if (node.children.length > 0 && !finishedChildren) {
                node = node.children[0];
                finishedChildren = false;
            } else if (node.parent != null && node.index < node.parent.children.length - 1) {
                node = node.parent.children[node.index + 1];
                finishedChildren = false;
            } else {
                node = node.parent;
                finishedChildren = true;
                findNext();
            }
        }
        const allItems = [...document.getElementById('inner-content').children, document.getElementById("title")];
        const search = (classItem) => {
            for (let i = 0; i < allItems.length; i++) if (allItems[i].classList.contains(classItem)) return allItems[i];
        };
        while (node != null) {
            let prefix = " ";
            for (let i = 0; i < node.depth; i++) prefix += "#";
            
            const indices = node.linkIndices();
    
            if (node.depth > 0) output += prefix + (search("nt-" + indices) ? search("nt-" + indices).innerText : node.name);
            output += `\n${ search("nc-" + indices) ? search("nc-" + indices).innerText : node.content}`;
    
            findNext();
        }
    
        output = " " + output.trim();
    
        localStorage.setItem('raw', output);
        return output;
    }
};

module.exports = TreeNode;