const LabelingDroid = require('../lib/labeling-droid')
const payload = require('./fixtures/payload')

describe ('LabelingDroid', () => {
  describe('STATE', () => {
    test('should return Labeling.STATE', () => {
      expect(LabelingDroid.STATE).toMatchObject({
        WIP: 'labelWip',
        UNREVIED: 'labelUnreviewed',
        APPROVED: 'labelApproved',
        CHANGES_REQUESTED: 'labelChangesRequested'
      })
    })
  }) // STATE

  describe('getState', () => {
    describe('when pull request is WIP', () => {
      test(' using async/await', async () => {
        const pullRequestPayload = payload['pull_request_wip']
        const github = {
          issues: {
            get: jest.fn().mockReturnValue(Promise.resolve(pullRequestPayload)),
            getLabel: jest.fn().mockReturnValue(Promise.resolve({})),
            createLabel: jest.fn().mockReturnValue(Promise.resolve({})),
          },
          pullRequests: {
            getReviews: jest.fn().mockReturnValue(Promise.resolve({}))
          }
        }
        const labelingDroid = new LabelingDroid(github, { sha: 'head' })
        await labelingDroid.init()
        const result = await labelingDroid.getState()
        expect(result).toBe(LabelingDroid.STATE.WIP)
      })
    })

    describe('when pull request is NOT WIP', () => {
      describe('but there are NO reviews', () => {
        test(' using async/await', async () => {
          const pullRequestPayload = payload['pull_request']
          const github = {
            issues: {
              get: jest.fn().mockReturnValue(Promise.resolve(pullRequestPayload)),
              getLabel: jest.fn().mockReturnValue(Promise.resolve({})),
              createLabel: jest.fn().mockReturnValue(Promise.resolve({})),
            },
            pullRequests: {
              getReviews: jest.fn().mockReturnValue(Promise.resolve({data: []}))
            }
          }
          const labelingDroid = new LabelingDroid(github, { sha: 'head' })
          await labelingDroid.init()
          const result = await labelingDroid.getState()
          expect(result).toBe(LabelingDroid.STATE.UNREVIED)
        })
      })

      describe('there are reviews', () => {
        test('should be Labeling.STATE.APPROVED using async/await', async () => {
          const pullRequestPayload = payload['pull_request']
          const reviewsPayload = payload['reviews_approved']
          const github = {
            issues: {
              get: jest.fn().mockReturnValue(Promise.resolve(pullRequestPayload)),
              getLabel: jest.fn().mockReturnValue(Promise.resolve({})),
              createLabel: jest.fn().mockReturnValue(Promise.resolve({})),
            },
            pullRequests: {
              getReviews: jest.fn().mockReturnValue(Promise.resolve(reviewsPayload))
            }
          }
          const labelingDroid = new LabelingDroid(github, { sha: 'head' })
          await labelingDroid.init()
          expect((await labelingDroid.getState())).toBe(LabelingDroid.STATE.APPROVED)
        })
      })

      describe('there are reviews', () => {
        test('should be Labeling.STATE.CHANGES_REQUESTED using async/await', async () => {
          const pullRequestPayload = payload['pull_request']
          const reviewsPayload = payload['reviews_changes_requested']
          const github = {
            issues: {
              get: jest.fn().mockReturnValue(Promise.resolve(pullRequestPayload)),
              getLabel: jest.fn().mockReturnValue(Promise.resolve({})),
              createLabel: jest.fn().mockReturnValue(Promise.resolve({})),
            },
            pullRequests: {
              getReviews: jest.fn().mockReturnValue(Promise.resolve(reviewsPayload))
            }
          }
          const labelingDroid = new LabelingDroid(github, { sha: 'head' })
          await labelingDroid.init()
          expect((await labelingDroid.getState())).toBe(LabelingDroid.STATE.CHANGES_REQUESTED)
        })
      })
    })
  }) // getState

  describe('_getFilteredReviews', () => {
    const github = {
      pullRequests: {
        getReviews: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    const labelingDroid = new LabelingDroid(github, {})

    test('should call GitHub API to get reviews', async () => {
      labelingDroid._getFilteredReviews()
      expect(github.pullRequests.getReviews).toHaveBeenCalled()
    })
  }) // _getFilteredReviews

  describe('_getUniqueReviews', () => {
    const subject = (sha, argument) => {
      const labelingDroid = new LabelingDroid({}, { sha })
      return labelingDroid._getUniqueReviews(argument)
    }

    describe('when there are reviews', () => {
      describe('and reviewd by different people', () => {
        test('should be unique', () => {
          expect(subject('head', payload['reviews'].data)).toMatchObject([
            { user_id: 1, state: payload['reviews'].data[0].state },
            { user_id: 2, state: payload['reviews'].data[1].state }
          ])
        })
      })

      describe('but one of the review is based on behind commit', () => {
        test('should return only reviews for head commit', () => {
          expect(subject('head', payload['reviews_behind'].data)).toMatchObject([
            { user_id: 1, state: payload['reviews_behind'].data[0].state }
          ])
        })
      })

      describe('and some of them are reviewed by same user', () => {
        test('should be unique', () => {
          expect(subject('head', payload['reviews_duplicated'].data)).toMatchObject([
            { user_id: 1, state: payload['reviews_duplicated'].data[1].state }
          ])
        })
      })
    })

    describe('when there are NO reviews', () => {
      test('should be empty', () => {
        expect(subject('', [])).toMatchObject([])
      })
    })
  }) // _getUniqueReviews

  describe('_getConfigValue', () => {
    const labelingDroid = new LabelingDroid({})
    const subject = (argument) => labelingDroid._getConfigValue(argument)

    describe('when there is a specified key', () => {
      test('should not be undefined', () => {
        const argument = 'wipRegex'
        expect(subject(argument)).not.toBeUndefined()
      })
    })

    describe('when there is NO specified key', () => {
      test('should be undefined', () => {
        const argument = 'undefined'
        expect(subject(argument)).toBeUndefined()
      })
    })
  }) // _getConfigValue

  describe('_getFilteredConfigWithRegex', () => {
    const labelingDroid = new LabelingDroid({})
    const subject = () => labelingDroid._getFilteredConfigWithRegex(/label*/)

    describe('when there is a key that matches the regex', () => {
      test('should return filtered object', () => {
        expect(subject()).toMatchObject({
          labelUnreviewed: expect.any(Object),
          labelApproved: expect.any(Object),
          labelChangesRequested: expect.any(Object)
        })
      })
    })

    describe('when there is NO key that matchs the regex', () => {
      test('should be empty Object', () => {
        expect(subject()).toMatchObject({})
      })
    })
  }) // _getFilteredConfigWithRegex

  describe('_isEmptyObj', () => {
    const labelingDroid = new LabelingDroid({})
    const subject = (argment) => labelingDroid._isEmptyObj(argment)

    describe('when object is empty', () => {
      test('should be true', () => {
        const argument = {}
        expect(subject(argument)).toBeTruthy()
      })
    })

    describe('when object is NOT empty', () => {
      test('should be false', () => {
        const argument = { isEmpty: false }
        expect(subject(argument)).toBeFalsy()
      })
    })
  })// _isEmptyObj
})
