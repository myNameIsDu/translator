import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { readObjectComplete } from '../helper';
import { completeJsonPath } from '../const';
import fs from 'fs';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    if (typeof id !== 'string') {
        return json(null, 400);
    }
    const completeData = readObjectComplete();
    delete completeData[id];
    fs.writeFileSync(completeJsonPath, JSON.stringify(completeData, null, 2));
    return new Response();
};
