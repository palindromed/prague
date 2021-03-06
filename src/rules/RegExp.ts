import { Observable } from 'rxjs';
import { ITextMatch } from '../recipes/Text';
import { IRule, SimpleRule, Matcher, Handler, arrayize } from '../Rules';

export interface IRegExpMatch {
    groups: RegExpExecArray;
}
export const RegExpHelpers = <M extends ITextMatch>() => {
    // helpers are first defined as local variables so that they can call each other if necessary

    const matchRegExp = (intents: RegExp | RegExp[]): Matcher<M, M & IRegExpMatch> =>
        (match) => 
            Observable.from(arrayize(intents))
            .do(_ => console.log("RegExp.match matching", match))
            .map(regexp => regexp.exec(match.text))
            .do(groups => console.log("RegExp.match result", groups))
            .filter(groups => groups && groups[0] === match.text)
            .take(1)
            .do(groups => console.log("RegExp.match returning", groups))
            .map(groups => ({
                ... match as any, // remove "as any" when TypeScript fixes this bug,
                groups
            }));

    // Either call as re(intent, action) or re([intent, intent, ...], action)
    const re = (intents: RegExp | RegExp[], handler: Handler<M & IRegExpMatch>) => {
        return new SimpleRule(
            matchRegExp(intents),
            handler
        ) as IRule<M>;
    }

    return {
        matchRegExp,
        re
    };
}
