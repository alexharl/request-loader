/*
MIT License

Copyright (c) 2018 Alexander Harl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export class BaseEvent {
    public url: string;

    public title: string;
    public subtitle: string;
    public description: string;

    public date: BaseEvent.DateInfo;

    public media: BaseEvent.Media[];

    public additionalInfo: any;

    constructor(public type: string, public id?: string) {
        // TODO: maybe use 'nid' or 'uuid' to generate GUID 
        if (!id) this.id = 'xxxx-xxx-xxx-xxxx';
    }

    static parse(data) {
        const event = new BaseEvent('base-event', data.id);

        event.title = data.title;
        event.subtitle = data.subtitle;
        event.description = data.description;

        event.date = <BaseEvent.DateInfo>{
            start: data.startDate
        }

        return event;
    }
}

export namespace BaseEvent {
    export interface DateInfo {
        admittance?: number;
        start: number;
        end?: number;
        duration?: number;
    }

    export interface LocationInfo {
        title: string;
        id: string;
    }

    export enum MediaType {
        IMAGE,
        YT
    }
    export interface Media {
        type: BaseEvent.MediaType;
        uri: string;
    }
}


