import {
    type ActionFunction,
    unstable_composeUploadHandlers,
    unstable_createFileUploadHandler,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
    type NodeOnDiskFile,
} from '@remix-run/node';
import xlsx from 'node-xlsx';
import path from 'path';
import type { LocalesType } from '../../../common/config';
import { readObjectComplete } from '../helper';
import fs from 'fs';
import { completeJsonPath } from '~/const';

export const action: ActionFunction = async ({ request }) => {
    const uploadHandler = unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
            directory: path.resolve(__dirname, '../upload'),
        }),
        // parse everything else into memory
        unstable_createMemoryUploadHandler(),
    );
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const file = formData.get('file')! as unknown as NodeOnDiskFile;
    const translatedData = xlsx.parse(await file.arrayBuffer())[0].data.slice(2) as [
        string,
        string,
        string,
    ][];
    const translatedObj = translatedData
        .filter(v => v[0] && v[1] && v[2])
        .reduce<LocalesType>((a, b) => {
            a[b[0]] = {
                zh: b[1],
                en: b[2],
            };
            return a;
        }, {});
    const completeData = readObjectComplete();
    const resultData = { ...completeData, ...translatedObj };
    fs.writeFileSync(completeJsonPath, JSON.stringify(resultData, null, 2));
    await file.remove();
    return new Response();
};
