# == Schema Information
#
# Table name: users
#
#  id               :integer          not null, primary key
#  fb_id            :integer          not null
#  edu_email        :string           not null
#  university_id    :integer          not null
#  marketing_opt_in :boolean          default("true"), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
