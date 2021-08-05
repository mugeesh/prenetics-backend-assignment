import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { logger } from '../component/logger';
import { Profile } from '../entity/profile';
import { Result } from '../entity/result';

export const resultController = new class {

    getProfileResult = async (request: Request, response: Response) => {
        request.checkParams('org', 'testId is not valid').isUUID();
        request.checkParams('profileId', 'testId is not valid').isUUID();
        request.checkParams('sampleId', 'sampleId is not valid').isString().notEmpty();
        const errors = request.validationErrors();
        if (errors) {
            response.status(400).json(errors);
            return;
        }

        const { org, profileId, sampleId } = request.params;
        try {
            const resultEnt = await getManager()
                .createQueryBuilder()
                .select('result')
                .from(Result, 'result')
                .innerJoin(
                    'result.profile',
                    'profile',
                    'profile.profileId = :profileId',
                    {
                        profileId,
                    }
                )
                .innerJoin(
                    'profile.organisation',
                    'organisation',
                    'organisation.organisationId = :organisationId',
                    {
                        organisationId: org,
                    }
                )
                .where(
                    'result.sampleId = :sampleId',
                    {
                        sampleId,
                    }
                )
                .getOne();
            if (resultEnt) {
                const { activateTime, resultTime, result, type: resultType, sampleId, resultId: id, } = resultEnt;
                response.status(200).json({
                    data: {
                        id,
                        type: 'result',
                        attributes: {
                            result,
                            sampleId,
                            resultType,
                            activateTime,
                            resultTime,
                        },
                    },
                });
            } else {
                response.status(404).json({ msg: 'Result not found' });
            }
        } catch (err) {
            logger.error(err.message);
            response.status(500).json({ msg: 'Something went wrong' });
        }
    }

    addResult = async (request: Request, response: Response) => {
        request.checkParams('org', 'testId is not valid').isUUID();
        request.checkParams('profileId', 'testId is not valid').isUUID();
        request.checkBody('data.type', 'type is not valid').equals('result');
        request.checkBody('data.attributes.sampleId', 'sampleId is not valid').notEmpty();
        request.checkBody('data.attributes.resultType', 'resultType is not valid').notEmpty();
        const errors = request.validationErrors();
        if (errors) {
            response.status(400).json(errors);
            return;
        }

        try {
            const { org, profileId } = request.params;
            const profile = await getManager()
                .createQueryBuilder()
                .select('profile')
                .from(Profile, 'profile')
                .innerJoin(
                    'profile.organisation',
                    'organisation',
                    'organisation.organisationId = :organisationId',
                    {
                        organisationId: org,
                    }
                )
                .where(
                    'profile.profileId = :profileId',
                    {
                        profileId,
                    }
                )
                .getOne();
            if (!profile) {
                response.status(404).json({ msg: 'Profile not found' });
                return;
            }
            const { sampleId, resultType } = request.body.data.attributes;
            const repo = getRepository(Result);
            const resultEnt = await repo.save(repo.create({
                sampleId,
                type: resultType,
                profile,
            }));
            const { activateTime, resultId: id, } = resultEnt;
            response.status(201).json({
                data: {
                    id,
                    type: 'result',
                    attributes: {
                        sampleId,
                        resultType,
                        activateTime,
                    },
                },
            });
        } catch (err) {
            logger.error(err.message);
            response.status(500).json({ msg: 'Something went wrong' });
        }
    }

};
