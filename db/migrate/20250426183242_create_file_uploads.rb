class CreateFileUploads < ActiveRecord::Migration[8.0]
  def change
    create_table :file_uploads do |t|
      t.string :name
      t.string :original_filename
      t.string :file_type
      t.integer :size_in_bytes
      t.integer :columns_count
      t.integer :rows_count
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
