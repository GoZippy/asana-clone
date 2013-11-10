require 'spec_helper'

describe Tag do
  it { should validate_presence_of :name }
  it { should validate_uniqueness_of :name }

  it { should have_many :tag_tasks }
  it { should have_many :tasks }
end
