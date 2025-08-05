const populateSkillMetaData = (skill) => {
  const totalSubmodules_in_skill = skill.modules.reduce(
    (totalSubmodules_in_skill, module) => {
      return totalSubmodules_in_skill + module.submodules.length;
    },
    0
  );

  const completedSubModules_in_skill = skill.modules.reduce(
    (completedSubModules_in_skill, module) => {
      return completedSubModules_in_skill + module.submodules.reduce(
        (completedSubModules_in_skill, submodule) => {
          return submodule.status === "Completed"
            ? completedSubModules_in_skill + 1
            : completedSubModules_in_skill;
        },
        0
      );
    },
    0
  );

  skill.totalSubmodules = totalSubmodules_in_skill;
  skill.completedSubModules = completedSubModules_in_skill;
  skill.progress = totalSubmodules_in_skill > 0
    ? Math.floor((completedSubModules_in_skill / totalSubmodules_in_skill) * 100)
    : 0;

  skill.modules.forEach((module) => {
    module.totalSubmodules = module.submodules.length;
    const completedSubModules = module.submodules.reduce((complete, sub) => {
      return (sub.status === "Completed") ? complete + 1 : complete;
    }, 0);

    module.progress = module.totalSubmodules > 0
      ? Math.floor((completedSubModules / module.totalSubmodules) * 100)
      : 0;
  });
};

module.exports = populateSkillMetaData;
