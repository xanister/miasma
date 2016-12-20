import { IGermOptions, Germ } from "./Germ";

export const Replicator = {
    generateGerm(options: IGermOptions): Germ {
        return new Germ(options);
    },
    generateGerms(count: number, options: IGermOptions): Germ[] {
        let germs = [];
        for (let i = 0; i< count; i++) 
            germs.push(Replicator.generateGerm(options));
        return germs;
    }
};