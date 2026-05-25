<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    //
    protected $fillable = [
        'name', 'short_description', 'long_description', 'image','slug','is_featured', 'meta_data', 'is_archived'
    ];
}
