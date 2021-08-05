export interface Test {
    name: string;
    value: string;
    comment?: string;
    user?: string;
}

export interface Content {
    content: string;
    subject: string;
}

export interface Variable {
    [variable: string]: string;
}

export interface Template {
    templateId: string;
    variable: Variable;
}

export type Message = Template | Content;

export interface NotifcationMessage {
    sender: string;
    receiver: string;
    message: Message;
}

export type MessageSender = (msg: NotifcationMessage) => Promise<string>;
