import { Germ } from "./Germ";

export const Replicator = {
    generateGerm(): Germ {
        let g = new Germ();
        g.reset();
        return g;
    },
    generateGerms(count: number): Germ[] {
        let germs = [];
        for (let i = 0; i< count; i++) 
            germs.push(Replicator.generateGerm());
        return germs;
    }
};