import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import { App } from 'aws-cdk-lib';
import * as BuildOnWeekly from '../lib/build-on-weekly-stack';

test('Not Empty Stack', () => {
    const app = new App();
    // WHEN
    const stack = new BuildOnWeekly.BuildOnWeeklyStack(app, 'BuildOnWeeklyStack');
    // THEN
    expectCDK(stack).notTo(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
