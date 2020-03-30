import * as _ from 'lodash';

export interface Tag {
  id: string;
  name: string;
}
export class Tagger {
  private readonly tag: Tag;
  constructor(
    public id: string,
    public name: string,
    public tagPath: string,
    public checkPaths: string[] = [],
    public regExps: RegExp[] = [],
    public iterate: (data: any, tag: Tag) => boolean
  ) {
    this.tag = { id, name };
  }
  regExp(regExps: RegExp[] = []) {
    this.regExps.push(...regExps);
  }
  paths(checkPaths: string[] = []) {
    this.checkPaths.push(...checkPaths);
  }
  each(iterate: (data: any) => boolean) {
    this.iterate = iterate;
  }
  exec(data: any[]) {
    return _.filter(data, item => {
      // base check
      let tagged = this.iterate ? this.iterate(item, this.tag) : false;

      if (!tagged) {
        //iterate paths
        for (let path of this.checkPaths) {
          const value = _.get(item, path);
          //iterate regexps
          for (let regExp of this.regExps) {
            if (Array.isArray(value)) {
              //iterate array values
              for (let arrVal of value) {
                tagged = arrVal.test(regExp);
                if (tagged) break;
              }
            } else {
              //iterate single value
              tagged = value.test(regExp);
              if (tagged) break;
            }
          }
        }
      }

      if (tagged) {
        /* add tag */
        const tags = _.get(item, this.tagPath);
        if (!tags) _.set(item, this.tagPath, []);
        tags.push(this.tag);
        return true;
      }
    });
  }
}
