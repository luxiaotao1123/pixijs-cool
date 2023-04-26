import { Configuration, OpenAIApi } from 'openai'

export default class CoolGpt {

    static #organization = "org-GSDrqLKmjbrk4eLEw3UOq6XW";

    static #apiKey = "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";

    static #config;
    static #openai;

    static get openai() {
        if (!CoolGpt.#config) {
            CoolGpt.#config = new Configuration({
                organization: CoolGpt.#organization,
                apiKey: CoolGpt.#apiKey,
            });
            CoolGpt.#config.baseOptions.headers['User-Agent'] = 'CoolGpt/1.0';
        }
        if (!CoolGpt.#openai) {
            CoolGpt.#openai = new OpenAIApi(CoolGpt.#config);
        }
        return CoolGpt.#openai;
    }

    static async ask(msg) {
        const res = await CoolGpt.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: msg,
                },
            ],
        });
        const choices = res?.data?.choices;
        if (!choices || choices.length === 0) {
            return null;
        }
        return choices.map((choice) => choice.message.content);
    }

}
