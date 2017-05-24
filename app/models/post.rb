# == Schema Information
#
# Table name: posts
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  description :text             not null
#  price       :integer          not null
#  img_url1    :string           not null
#  img_url2    :string
#  category_id :integer          not null
#  course_id   :integer
#  zip_code    :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  title       :string           not null
#  img_url3    :string
#  views       :integer          default(1)
#  active      :boolean          default(TRUE)
#  deleted     :boolean          default(FALSE)
#

class Post < ApplicationRecord
  validates :user, :description,
            :price, :img_url1, :category,
            :zip_code, :title, presence: true

  has_many :bookmarks
  belongs_to :category
  belongs_to :course, inverse_of: :posts, optional: true
  belongs_to :user

  after_create :check_rfps

  def check_rfps
    Rfp.all.each do |rfp|
      check_relevance(rfp.description, rfp.user)
    end
  end

  def check_relevance(description, user)
    post = self.as_json
    relevance_score = calc_score(post, description)
    if relevance_score >= 10
      UserMailer.rfp_alert(user, post, description).deliver
    end
  end

  private

  def calc_score(post, query)
    categories = ['Course Material', 'Clothing', 'Furniture', 'Electronics',
                  'Lost & Found', 'Games', 'Bikes', 'Housing', 'Others']

    query = query.split(' ')
    score = 0
    max = 0

    query.each do |word|
      max += word.length
      if post['title'].downcase.include? word.downcase
        score += word.length
      elsif categories[post['category_id'] + 1] == word.capitalize
        score += 10
      end
    end

    score
  end

end
