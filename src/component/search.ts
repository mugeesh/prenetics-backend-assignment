import { Request } from 'express';
import { EntityManager } from 'typeorm';
import { Organisation } from '../entity/organisation';
import { ResultType } from './type';

export async function search(
    manager: EntityManager,
    organisation: Organisation,
    params: Request['params'],
) {
    // Implement search function;
    return {
        meta: {
            total: 5,
        },
        data: [
            {
                id: '1c22dfc1-9c85-4ef9-a9d3-41a1e98a4d41',
                type: 'sample',
                attributes: {
                    result: 'negative',
                    sampleId: '1234567890',
                    resultType: ResultType.rtpcr,
                    activateTime: '2021-07-12 15:00:00',
                    resultTime: '2021-07-12 16:00:00',
                },
            },
            {
                id: '98627793-ee13-4eaf-a304-9e628d110f3c',
                type: 'sample',
                attributes: {
                    result: 'negative',
                    sampleId: '0987654321',
                    resultType: ResultType.rtpcr,
                    activateTime: '2021-07-12 19:00:00',
                    resultTime: '2021-07-12 20:00:00',
                },
            },
            {
                id: 'ab5b87ef-e44f-4b1f-98cb-992f2104ef8f',
                type: 'sample',
                attributes: {
                    result: 'negative',
                    sampleId: '109876543211',
                    resultType: ResultType.antigen,
                    activateTime: '2021-07-13 15:00:00',
                    resultTime: '2021-07-13 16:00:00',
                },
            },
            {
                id: '8423dfd3-37b5-4c62-a37c-729e410d19e5',
                type: 'sample',
                attributes: {
                    result: 'negative',
                    sampleId: '121212121212',
                    resultType: ResultType.antibody,
                    activateTime: '2021-07-14 15:00:00',
                    resultTime: '2021-07-14 16:00:00',
                },
            },
            {
                id: '567a8b28-c1ab-467d-85ff-04fbcb24cb9a',
                type: 'sample',
                attributes: {
                    result: 'negative',
                    sampleId: '181818188181',
                    resultType: ResultType.antigen,
                    activateTime: '2021-07-15 15:00:00',
                    resultTime: '2021-07-15 16:00:00',
                },
            },
        ],
    };
}
