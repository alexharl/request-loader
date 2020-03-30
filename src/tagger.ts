import * as _ from 'lodash';

interface Tag {
  id: string;
  name: string;
}

export class Tagger {
  private readonly tag: Tag;
  constructor(
    public id: string,
    public name: string,
    public tagPath: string,
    public regexPathMap: { [path: string]: RegExp[] },
    public iterate: (data: any, tag: Tag) => boolean
  ) {
    this.tag = { id, name };
  }
  regExp(path: string, regExps: RegExp[] = []) {
    this.regexPathMap[path].push(...regExps);
  }
  each(iterate: (data: any) => boolean) {
    this.iterate = iterate;
  }
  exec(data: any[]) {
    return _.filter(data, item => {
      // base check
      let tagged: any = this.iterate ? this.iterate(item, this.tag) : false;
      if (!tagged) {
        //iterate paths
        for (let path in this.regexPathMap) {
          const value = _.get(item, path);
          const regExps = this.regexPathMap[path];
          //iterate regexps
          for (let regExp of regExps) {
            if (Array.isArray(value)) {
              //iterate array values
              for (let arrVal of value) {
                const match = regExp.test(arrVal);
                match && (tagged = value);
                if (tagged) break;
              }
            } else {
              //iterate single value
              const match = regExp.test(value);
              match && (tagged = value);
              if (tagged) break;
            }
          }
        }
      }

      if (tagged) {
        /* add tag */
        let tags = _.get(item, this.tagPath);
        if (!tags) {
          _.set(item, this.tagPath, []);
          tags = _.get(item, this.tagPath);
        }
        tags.push(this.tag);
        return true;
      }
    });
  }
}
