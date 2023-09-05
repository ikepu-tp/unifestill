<?php

namespace App\Http\Requests;

use App\Exceptions\Error\NotExistRecordException;
use App\Exceptions\Error\UnauthorizedException;
use App\Models\Project as ModelsProject;

trait Project
{
    /**
     * @var ModelsProject
     */
    private $project;

    /**
     * @return ModelsProject
     *
     * @throws NotExistRecordException
     * @throws UnauthorizedException
     */
    public function getProject()
    {
        if (!$this->project) {
            $this->project = $this->route("project", "");
            if (is_string($this->project))
                $this->project = ModelsProject::where('projectId', $this->project)->first();
            if (!$this->project)
                throw new NotExistRecordException("存在しないプロジェクトです");
            if ($this->project->association_id !== $this->user('associations')->id)
                throw new UnauthorizedException("アクセスできないプロジェクトです");
        }
        return $this->project;
    }
}
