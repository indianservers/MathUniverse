import {test,expect} from '@playwright/test';
test.use({video:'off',screenshot:'off',trace:'off'});
test('admin candidate is isolated and publication is blocked until measured gates pass',async({page})=>{
 test.setTimeout(120000);await page.goto('/model-training');await expect(page.getByRole('heading',{name:'Ruhi Intelligence v4.1',exact:true,level:1})).toBeVisible();
 await page.getByRole('tab',{name:'Publish',exact:true}).click();await expect(page.getByRole('button',{name:'Approve and export candidate'})).toBeDisabled();
 await page.getByRole('tab',{name:'Dataset',exact:true}).click();await page.getByRole('button',{name:'Load bundled starter dataset'}).click();
 await page.getByRole('tab',{name:'Train',exact:true}).click();await page.getByLabel('v4 epochs',{exact:true}).fill('1');await page.getByRole('button',{name:'Train v4 model',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('Candidate saved separately',{timeout:90000});
 await page.getByRole('tab',{name:'Publish',exact:true}).click();await expect(page.getByRole('button',{name:'Approve and export candidate'})).toBeDisabled();await expect(page.getByText('Run execution, context, and adversarial regression.',{exact:true})).toBeVisible();
 await page.getByRole('tab',{name:'Confusion Matrix',exact:true}).click();await expect(page.getByRole('heading',{name:'Measured action and subaction confusion'})).toBeVisible();
});
