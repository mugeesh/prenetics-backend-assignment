import { Request } from 'express';
import { EntityManager } from 'typeorm';
import { Organisation } from '../entity/organisation';
import { Result } from '../entity/result';

export async function search(
    manager: EntityManager,
    organisation: Organisation,
    query: Request['query']
) {
    const {
        limit = 0,
        offset = 0,
        sampleId = '',
        activateTime = '',
        patientName = '',
        resultTime = '',
        patientId = '',
    } = query;

    const querybuilder = manager.createQueryBuilder()
        .select('result')
        .from(Result, 'result')
        .innerJoinAndSelect('result.profile', 'profile')
        .innerJoin('profile.organisation', 'organisation',
            'organisation.organisationId = :organisationId',
            {organisationId: organisation.organisationId}
        )
        .offset(Number(offset) * Number(limit))
        .limit(Number(limit));

    if (patientName) {
        querybuilder.andWhere('profile.name = :patientName', {patientName: patientName});
    }
    if (sampleId) {
        querybuilder.andWhere('result.sampleId = :sampleId', {sampleId: sampleId});
    }
    if (activateTime) {
        querybuilder.andWhere(`DATE_TRUNC('day', result.activateTime) = :activateTime`, {activateTime: activateTime});
    }
    if (resultTime) {
        querybuilder.andWhere(`DATE_TRUNC('day', result.resultTime) = :resultTime`, {resultTime: resultTime});
    }
    if (patientId) {
        querybuilder.andWhere('profile.profileId = :patientId', {patientId: patientId});
    }

    const result = await querybuilder.getManyAndCount();

    // Define which orgs get the extra fields
    const orgGetsExtras = organisation.name === 'Circle'; // change other organization

    return {
        meta: {
            total: result[1]
        },
        data: result[0].map(({result, resultId, sampleId, type, activateTime, resultTime, profile}) => ({
            id: resultId,
            type: 'sample',
            attributes: {
                result,
                sampleId,
                activateTime,
                resultTime,
                type: orgGetsExtras ? type : undefined,      // result type
                patientId: orgGetsExtras ? profile.profileId : undefined, // patient ID as attribute
            },
            relationships: {
                profile: {
                    data: {
                        type: 'profile',
                        id: profile.profileId
                    }
                }
            }
        })),
        included: result[0].map(({profile}) => ({
            type: 'profile',
            id: profile.profileId,
            attributes: {
                name: profile.name
            }
        }))
    };
}
