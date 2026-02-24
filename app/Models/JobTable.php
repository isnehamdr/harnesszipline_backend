<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobTable extends Model
{
    //
    protected $fillable = [
        'title','short_description','content','meta_data','is_archived'
    ];
}
