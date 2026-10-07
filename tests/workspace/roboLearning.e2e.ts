import {test,expect} from '@playwright/test';

test('Robo persists a taught phrase across reloads and can forget it',async({page})=>{
  test.setTimeout(120000);
  await page.goto('/workspace/geometry');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});
  await page.getByText('Teach Ruhi · 0 learned phrases',{exact:true}).click();
  await page.getByLabel('Your phrase',{exact:true}).fill('my moon');
  await page.getByLabel('What it should mean',{exact:true}).fill('Create circle radius 5');
  await page.getByRole('button',{name:'Learn correction',exact:true}).click();
  await expect(page.locator('.robo-learning-status')).toContainText('Correction saved',{timeout:60000});
  await page.reload();
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});
  await expect(page.getByText('Teach Ruhi · 1 learned phrases',{exact:true})).toBeVisible();
  await page.getByLabel('What would you like to create or solve?').fill('my moon');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.locator('.robo-answer')).toContainText('Created 2D circle');
  await expect(page.getByText('Your correction',{exact:true})).toBeVisible();
  await page.getByText('Teach Ruhi · 1 learned phrases',{exact:true}).click();
  await page.getByRole('button',{name:'Clear learned phrases',exact:true}).click();
  await expect(page.getByText('Teach Ruhi · 0 learned phrases',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('math-robo-learning-v1'))).toBeNull();
});
