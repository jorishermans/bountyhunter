import { MemoryStore, TextHill } from '../src';

// here the whole foo var is mocked deeply
const searchName = 'Microsoft';

test('unfeed a doc', async () => {
    var mem = new MemoryStore();
    const th = new TextHill(mem);
    await th.feedDoc("hello world", "A 'Hello world' program is a computer program that outputs 'Hello, World!' (or some variant thereof) on a display device. Because it is typically one of the simplest programs possible in most programming languages, it is by tradition often used to illustrate to beginners the most basic syntax of a programming language. It is also used to verify that a language or system is operating correctly.");
    await th.feedDoc("computer program", "A computer program, or just a program, is a sequence of instructions, written to perform a specified task with a computer.[1] A computer requires programs to function, typically executing the program's instructions in a central processor.[2] The program has an executable form that the computer can use directly to execute the instructions. The same program in its human-readable source code form, from which executable programs are derived (e.g., compiled), enables a programmer to study and develop its algorithms. A collection of computer programs and related data is referred to as the software.");
    await th.feedDoc("typescript", "TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for development of large applications and transcompiles to JavaScript.[4] As TypeScript is a superset of JavaScript, existing JavaScript programs are also valid TypeScript programs.");

    const results = await th.search(searchName);     
    expect(results[0].name).toBe("typescript");

    const s = await th.searchModel();
    expect(s.index['microsoft']).toHaveLength(1);

    await th.removeDoc("typescript");
    const results2 = await th.search("Microsoft");     
    expect(results2).toHaveLength(0);

    const rSearch = await th.searchModel();
    expect(rSearch.index['microsoft']).toBeUndefined();
});

test('check cleanup of index', async () => {
    var mem = new MemoryStore();
    const th = new TextHill(mem);
    await th.feedDoc("hello world", "A 'Hello world' program is a computer program that outputs 'Hello, World!' (or some variant thereof) on a display device. Because it is typically one of the simplest programs possible in most programming languages, it is by tradition often used to illustrate to beginners the most basic syntax of a programming language. It is also used to verify that a language or system is operating correctly.");
    await th.feedDoc("computer program", "A computer program, or just a program, is a sequence of instructions, written to perform a specified task with a computer.[1] A computer requires programs to function, typically executing the program's instructions in a central processor.[2] The program has an executable form that the computer can use directly to execute the instructions. The same program in its human-readable source code form, from which executable programs are derived (e.g., compiled), enables a programmer to study and develop its algorithms. A collection of computer programs and related data is referred to as the software.");
    await th.feedDoc("typescript", "TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for development of large applications and transcompiles to JavaScript.[4] As TypeScript is a superset of JavaScript, existing JavaScript programs are also valid TypeScript programs.");
    await th.feedDoc("abc", "Microsoft has multiple programming languages.");

    const s = await th.searchModel();
    expect(s.index['microsoft']).toHaveLength(2);

    await th.removeDoc("typescript");

    const s2 = await th.searchModel();
    expect(s2.index['microsoft']).toHaveLength(1);
});

test('cleanup should succeed when only 1 doc is been unfeed', async () => {
    var mem2 = new MemoryStore();
    const thOnly = new TextHill(mem2);
    await thOnly.feedDoc("typescript", "TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language. TypeScript is designed for development of large applications and transcompiles to JavaScript.[4] As TypeScript is a superset of JavaScript, existing JavaScript programs are also valid TypeScript programs.");

    const s = await thOnly.searchModel();
    expect(s.index['microsoft']).toHaveLength(1);

    await thOnly.removeDoc("typescript");

    const rSearch = await thOnly.searchModel();
    expect(rSearch.index['microsoft']).toBeUndefined();
});
