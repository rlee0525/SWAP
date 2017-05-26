class Api::MyCoursesController < ApplicationController
  def index
    user = fb_auth_user(params[:access_token])
    @my_courses = user.courses
    render "api/my_courses/index", status: 200
  end

  def create
    user = fb_auth_user(params[:access_token])
    @my_course = UsersCourse.new(
      user: user,
      cours: course
    )
    if @my_course.save
      render "api/my_courses/show", status: 200
    else
      render json: @my_course.errors.full_messages, status: 422
    end
  end

  def destroy
    user = fb_auth_user(params[:access_token])
    @my_courses = UsersCourse.where(user: user)
                  .where(course: Course.find(params[:id]))
    @my_courses.each(&:destroy)
    @my_courses = user.courses
    render "api/my_courses/index", status: 200
  end
end
