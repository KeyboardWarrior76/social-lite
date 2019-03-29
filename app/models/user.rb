# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  include DeviseTokenAuth::Concerns::User

  has_many :sent_messages, class_name: "Message", foreign_key: "from_user_id", dependent: :destroy
  has_many :received_messages, class_name: "Message", foreign_key: "to_user_id", dependent: :destroy

  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy

  serialize :friends, Array

  def self.add_friend(user, friend)
    user.friends.push(friend.id)
    user.save()
    
    friend.friends.push(user.id)
    friend.save()
  end

  def self.remove_friend(user, friend)
    user.friends.reject!() {|user_id|
      user_id == friend.id
    }
    user.save()

    friend.friends.reject!() {|user_id|
      user_id == user.id
    }
    friend.save()
  end

  def get_friends
    friend_array = []

    self.friends.each() {|friend_id|
      friend_array.push(User.find(friend_id));
    }
    return friend_array
  end 

  def self.search_users(input)
    User.find_by_sql(["
      SELECT * FROM users
      WHERE email LIKE ?
    ", "#{input}%" ])
  end

  def delete_user
    self.friends.each() {|user_id|
      friend = User.find(user_id)
      friend.friends.reject!() {|user_id| user_id == self.id }
      friend.save()
    }
    self.delete()
  end
end
