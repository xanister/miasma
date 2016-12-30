import { Germ, IGermOptions } from "./Germ";

export const Replicator = {
    generateGerm(options: IGermOptions): Germ {
        let g = new Germ(options);
        g.reset();
        return g;
    },
    generateGerms(count: number, options: IGermOptions): Germ[] {
        let germs = [];
        for (let i = 0; i< count; i++) 
            germs.push(Replicator.generateGerm(options));
        return germs;
    }
};