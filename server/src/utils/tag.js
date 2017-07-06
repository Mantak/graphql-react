// tags 存在于
// 1, users.profile.tags [{tag, count}, ...] 用户个人的tags数据，是冗余数据，本
// 来可以通过tagger获取，但是只有保存到user中，才能reactive
// 2, tags [{_id, tag, count},...]
// 3, tagger [{user_id, type, type_id, tags}, ...]
import difference from 'lodash/difference';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

import TagModel from '/imports/api/tags/collection';
import TaggerModel from '/imports/api/taggers/collection';
import UserModel from '/imports/api/users/collection';
import BookModel from '/imports/api/books/collection';
import MindmapModel from '/imports/api/mindmaps/collection';
import UmlModel from '/imports/api/umls/collection';
import ProblemModel from '/imports/api/problems/collection';

export const TAGABLES = {book: BookModel, mindmap: MindmapModel, uml: UmlModel, problem: ProblemModel};

// profile.tags [{ tag, count}, {}]
function addUserTag(tagObj, userId = Meteor.userId()) {
  const user = UserModel.findOne(userId);
  const tags = user.profile && user.profile.tags || [];
  let has = false;
  if (tags.length > 0) {
    tags.forEach((t) => {
      if (t.tag === tagObj.tag) {
        t.count ++;
        has = true;
      }
    });
  }
  if (!has) {
    const item = {tag: tagObj.tag, count: 1};
    tags.push(item);
  }
  if (!user.profile) {
    user.profile = {};
  }
  user.profile.tags = sortBy(tags, ['count']).reverse();
  user.save();
}

function delUserTag(tagObj, userId = Meteor.userId()) {
  const user = UserModel.findOne(userId);
  const tags = user.profile && user.profile.tags || [];
  tags.forEach((t, i) => {
    if (t.tag === tagObj.tag) {
      if (t.count > 1) {
        t.count --;
      } else {
        tags.splice(i, 1);
      }
    }
  });
  user.profile.tags = sortBy(tags, ['counts']).reverse();
  user.save();
}

function genTags(tags) {
  const tagIds = [];
  tags.forEach((v) => {
    let tag = TagModel.findOne({tag: v});
    if ( !tag ) {
      tag = new TagModel({tag: v, count: 1});
      tag.save();
      tagIds.push(tag._id);
    } else {
      tag.count ++;
      tag.save();
      tagIds.push(tag._id);
    }
    // 更新用户tag
    addUserTag(tag);
  });
  return tagIds;
}

function delTags(tags) {
  tags.forEach((v) => {
    const tag = TagModel.findOne({tag: v});
    if (!tag) return;
    if (tag.count > 1) {
      tag.count --;
      tag.save();
    } else {
      tag.remove();
    }
    // 更新用户tag
    delUserTag(tag);
  });
}

export function addTags( type, typeId, tagsArray) {
  const tags = uniq(tagsArray);
  genTags(tags);
  const model = {user_id: Meteor.userId(), type, type_id: typeId, tags};
  Meteor.call('Tagger.create', model);
}

export function changeTags(type, id, oldTags, tags) {
  const newTags = uniq(tags);
  const discardedTags = difference(oldTags, newTags);
  const freshTags = difference(newTags, oldTags);
  if (discardedTags.length > 0) {
    delTags(discardedTags);
  }
  genTags(freshTags);
  Meteor.call('Tagger.update', type, id, {tags: newTags});
}

export function removeTagger(type, typeId) {
  const tagger = TaggerModel.findOne({type, type_id: typeId});
  delTags(tagger.tags);
  tagger.remove();
}
