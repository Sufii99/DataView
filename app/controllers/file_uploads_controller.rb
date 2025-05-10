include Rails.application.routes.url_helpers

require "csv"
require "roo"

class FileUploadsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_file_upload, only: [ :destroy ]

  # GET /file_uploads
  def index
    @file_uploads = current_user.file_uploads
    render json: @file_uploads.map { |file| file_data(file) }
  end

  # POST /file_uploads
  def create
    @file_upload = current_user.file_uploads.new(name: params[:name])

    if params[:file]
      @file_upload.data_file.attach(params[:file])

      if @file_upload.data_file.attached?
        @file_upload.original_filename = @file_upload.data_file.filename.to_s
        @file_upload.size_in_bytes = @file_upload.data_file.byte_size
        @file_upload.file_type = detect_file_type(@file_upload.data_file)

        # Calcular filas y columnas
        rows, columns = count_rows_and_columns(@file_upload.data_file, @file_upload.file_type)
        @file_upload.rows_count = rows
        @file_upload.columns_count = columns
      end
    end

    if @file_upload.save
      render json: file_data(@file_upload), status: :created
    else
      render json: { errors: @file_upload.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /file_uploads/:id
  def destroy
    @file_upload.destroy
    head :no_content
  end

  private

  def set_file_upload
    @file_upload = current_user.file_uploads.find(params[:id])
  end

  def file_upload_params
    params.permit(:name)
  end

  def file_data(file)
    {
      id: file.id,
      name: file.name,
      original_filename: file.original_filename,
      file_type: file.file_type,
      size_in_bytes: file.size_in_bytes,
      columns_count: file.columns_count,
      rows_count: file.rows_count,
      created_at: file.created_at,
      file_url: url_for(file.data_file)
    }
  end

  def detect_file_type(file)
    case file.content_type
    when "text/csv"
      "csv"
    when "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      "xlsx"
    else
      "unknown"
    end
  end

  def count_rows_and_columns(attached_file, file_type)
    file_path = ActiveStorage::Blob.service.send(:path_for, attached_file.blob.key)

    case file_type
    when "csv"
      rows = 0
      max_cols = 0
      CSV.foreach(file_path, headers: true) do |row|
        rows += 1
        max_cols = [ max_cols, row.fields.count ].max
      end
      [ rows, max_cols ]

    when "xlsx"
      spreadsheet = Roo::Spreadsheet.open(file_path, extension: :xlsx)
      sheet = spreadsheet.sheet(0)
      rows = sheet.last_row.to_i - sheet.first_row.to_i + 1
      columns = sheet.last_column.to_i
      [ rows, columns ]

    else
      [ 0, 0 ]
    end
  end
end
