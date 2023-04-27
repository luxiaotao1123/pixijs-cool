import { Configuration, OpenAIApi } from 'openai'

export default class CoolGpt {

    static #config;
    static #openai;

    static get openai() {
        if (!CoolGpt.#config) {
            CoolGpt.#config = new Configuration({
                organization: import.meta.env.COOL_OPENAI_ORGANIZATION,
                apiKey: import.meta.env.COOL_OPENAI_API_KEY,
            });
            CoolGpt.#config.baseOptions.headers['User-Agent'] = 'CoolGpt/1.0';
            delete CoolGpt.#config.baseOptions.headers['User-Agent'];
        }
        if (!CoolGpt.#openai) {
            CoolGpt.#openai = new OpenAIApi(CoolGpt.#config);
        }
        return CoolGpt.#openai;
    }

    static async ask(msg) {
        console.log(msg);
        const res = await CoolGpt.openai.createChatCompletion({
            model: import.meta.env.COOL_OPENAI_MODEL,
            messages: [
                {
                    role: "user",
                    content: msg,
                },
            ],
        });
        console.log(res);
        const choices = res?.data?.choices;
        if (!choices || choices.length === 0) {
            return null;
        }
        return choices.map((choice) => choice.message.content);
    }


    /**
        import CoolGpt from '../util/CoolGpt';
        
        CoolGpt.ask("hello rebot").then(res => {
            console.log(res);
        });

        const res = await CoolGpt.ask('Hello');
        console.log(res);
     */
    
}
