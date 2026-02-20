<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    //
    protected $fillable = [
        'fullname',
        'address',
        'short_description',
        'long_description',
        'is_featured',
        'is_archived',
    ];
}
