import {test,expect} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
test.use({video:'off',screenshot:'off',trace:'off'});
test('admin conversation debugger verifies all predefined scenes',async({page})=>{
  test.skip(process.env.RUHI_ADMIN_TEST!=='true','Requires development or an explicitly enabled admin build.');
  await page.goto('/model-training');await page.getByRole('tab',{name:'Conversation Debugger',exact:true}).click();await page.getByRole('button',{name:'Replay conversation dataset',exact:true}).click();
  const output=page.getByRole('tabpanel',{name:'Conversation Debugger'}).locator('pre');await expect(output).toContainText('"total": 12');const report=JSON.parse(await output.innerText());expect(report.passed).toBe(report.total);await mkdir('artifacts/math-robo-conversation',{recursive:true});await writeFile('artifacts/math-robo-conversation/admin-replay.json',JSON.stringify(report,null,2));
});
