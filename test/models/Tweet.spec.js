process.env.NODE_ENV = 'test'

var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const TweetModel = require('../../models/tweet')

describe('# Tweet Model', () => {
  
  before(done => {
    done()

  })

  const Tweet = TweetModel(sequelize, dataTypes)
  const like = new Tweet()
  checkModelName(Tweet)('Tweet')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  context('associations', () => {
    const Reply = 'Reply'
    const Like = 'Like'
    const User = 'User'
    before(() => {
      Tweet.associate({ Reply })
      Tweet.associate({ Like })
      Tweet.associate({ User })
    })

    it('should have many replies', (done) => {
      expect(Tweet.hasMany).to.have.been.calledWith(Reply)
      done()
    })
    it('should have many likes', (done) => {
      expect(Tweet.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should belong to user', (done) => {
      expect(Tweet.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Tweet.create({}).then((like) => {   
        data = like
        done()
      })
    })
    it('read', (done) => {
        db.Tweet.findByPk(data.id).then((like) => {  
          expect(data.id).to.be.equal(like.id)
          done()
        })
    })
    it('update', (done) => {
      db.Tweet.update({}, { where: { id: data.id }}).then(() => {
        db.Tweet.findByPk(data.id).then((like) => { 
          expect(data.updatedAt).to.be.not.equal(like.updatedAt) 
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Tweet.destroy({ where: { id: data.id }}).then(() => {
        db.Tweet.findByPk(data.id).then((like) => { 
          expect(like).to.be.equal(null) 
          done()
        })
      })
    })
  })

})
