import { Server, Model, Factory, belongsTo, hasMany, Response } from 'miragejs';

import user from './routes/user';
import * as diary from './routes/diary';

export const handleErrors = (error: any, message = 'ERROR!') => {
    return new Response(400, undefined, {
        data: {
            message,
            isError: true,
        },
    });
};

export const setupServer = (env?: string): Server => {
    return new Server({
        environment: env ?? 'development',

        models: {
            note: Model.extend({
                notebook: belongsTo(),
            }),
            notebook: Model.extend({
                note: hasMany(),
                user: belongsTo(),
            }),
            user: Model.extend({
                notebook: hasMany(),
            }),
        },

        factories: {
            user: Factory.extend({
                username: 'test',
                password: 'password',
                email: 'test@email.com',
            }),
        },

        seeds: (server): any => {
            server.create('user');
        },

        routes(): void {
            this.urlPrefix = 'https://notes.app';

            this.get('/notebooks/notes/:id', diary.getEntries);
            this.get('/notebooks/:id', diary.getDiaries);

            this.post('/auth/login', user.login);
            this.post('/auth/signup', user.signup);

            this.post('/notebooks/', diary.create);
            this.post('/notebooks/note/:id', diary.addEntry);

            this.put('/notebooks/note/:id', diary.updateEntry);
            this.put('/notebooks/:id', diary.updateDiary);
        },
    });
};
